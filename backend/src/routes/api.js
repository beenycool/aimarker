const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const authController = require('../controllers/authController');
// const guildController = require('../controllers/guildController'); // Commented out
// const adminController = require('../controllers/adminController'); // Commented out
// const { authenticateToken, isAdmin } = require('../middleware/auth'); // isAdmin removed
const { authenticateToken } = require('../middleware/auth'); // isAdmin removed from imports
const { globalRateLimiter } = require('../middleware/rateLimit');
const { moderateUserInput, llamaGuard } = require('../middleware/llamaguard');

// Health check route
router.get('/health', (req, res) => {
  try {
    const moderationStats = llamaGuard.getModerationStats();
    
    res.status(200).json({
      status: 'ok',
      version: '1.0.0',
      openaiClient: true,
      apiKeyConfigured: true,
      moderation: {
        enabled: moderationStats.configured,
        service: moderationStats.service,
        model: moderationStats.model,
        dailyLimit: moderationStats.dailyLimit
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Moderation service health check
router.get('/moderation/health', (req, res) => {
  try {
    const stats = llamaGuard.getModerationStats();
    res.json({
      status: stats.configured ? 'configured' : 'not_configured',
      service: stats.service,
      model: stats.model,
      dailyLimit: stats.dailyLimit,
      costPerRequest: stats.costPerRequest,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Moderation health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Request limits endpoint - returns remaining requests per IP for each model
router.get('/request-limits', (req, res) => {
  try {
    const ip = req.ip;
    const now = Date.now();
    const RPD = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    
    // Import the cache and modelLimits from rateLimit middleware
    const { cache, modelLimits } = require('../middleware/rateLimit');
    
    const limits = {
      o3: 1, // Default to 1/day for O3
      'o4-mini': 2, // Default to 2 for O4 Mini
      'xai/grok-3': 1, // Default to 1 for Grok-3
      general: 'Unlimited' // For other models
    };
    
    // Check actual usage from cache for each model
    const modelChecks = {
      'o3': 'azure-openai-o3',
      'o4-mini': 'azure-openai-o4-mini',
      'xai/grok-3': 'xAI Grok-3'
    };
    
    Object.keys(modelChecks).forEach(frontendModel => {
      const backendModel = modelChecks[frontendModel];
      const dailyCacheKey = `global_daily_${backendModel}`;
      const dailyRecord = cache?.get?.(dailyCacheKey) || { count: 0, resetTime: now + RPD };
      
      // Reset if past reset time
      if (now > dailyRecord.resetTime) {
        dailyRecord.count = 0;
      }
      
      // Calculate remaining requests
      const modelLimit = modelLimits[backendModel];
      if (modelLimit) {
        const remaining = Math.max(0, modelLimit.daily - dailyRecord.count);
        limits[frontendModel] = remaining;
      }
    });
    
    res.json(limits);
  } catch (error) {
    console.error('Error fetching request limits:', error);
    // Return default limits on error
    res.json({
      o3: 1,
      'o4-mini': 2,
      'xai/grok-3': 1,
      general: 'Unlimited'
    });
  }
});

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authenticateToken, authController.logout);
router.get('/auth/user', authenticateToken, authController.getCurrentUser);

// Guild routes - Commented out as Guild model and controller are removed/being removed
// router.post('/guilds', authenticateToken, guildController.createGuild);
// router.get('/guilds', guildController.getAllGuilds);
// router.get('/guilds/:id', guildController.getGuildById);
// router.put('/guilds/:id', authenticateToken, guildController.updateGuild);
// router.post('/guilds/:id/join', authenticateToken, guildController.joinGuild);
// router.post('/guilds/:id/leave', authenticateToken, guildController.leaveGuild);

// Admin routes (protected by isAdmin middleware) - Commented out as Admin features are removed
// router.get('/admin/users', authenticateToken, isAdmin, adminController.getAllUsers);
// router.get('/admin/users/:id', authenticateToken, isAdmin, adminController.getUserById);
// router.get('/admin/dashboard', authenticateToken, isAdmin, adminController.getSiteActivityDashboard);
// router.get('/admin/sessions', authenticateToken, isAdmin, adminController.getActiveSessions);
// router.post('/admin/sessions/end', authenticateToken, isAdmin, adminController.endUserSession);

// // Consolidated leaderboard route for admin - Commented out
// router.get('/admin/leaderboards', authenticateToken, isAdmin, adminController.getCombinedLeaderboards);

// // Admin Guild Management Routes - Commented out
// router.get('/admin/guilds', authenticateToken, isAdmin, adminController.adminGetAllGuilds);
// router.post('/admin/guilds', authenticateToken, isAdmin, adminController.adminCreateGuild);
// router.put('/admin/guilds/:id', authenticateToken, isAdmin, adminController.adminUpdateGuild);
// router.delete('/admin/guilds/:id', authenticateToken, isAdmin, adminController.adminDeleteGuild);

// GitHub model API routes
router.post('/github/completions', globalRateLimiter, moderateUserInput, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Set headers for SSE to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE connection

    // Check if GitHub API key is configured
    if (!process.env.GITHUB_API_KEY) {
      console.error('GitHub API key not configured');
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'GitHub API Error: API key not configured in backend. Please try a different model.', status: 401 })}\n\n`);
      res.end();
      return;
    }

    // Get model from request or use default
    const githubModel = req.body.model || "xai/grok-3"; // Default to Grok if no model specified

    // Log the request for debugging (remove sensitive info)
    console.log('GitHub AI Request:', JSON.stringify({ 
      endpoint: 'https://models.github.ai/inference/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer [REDACTED]',
        'Accept': 'application/json'
      },
      body: { 
        messages: messages.map(m => ({ role: m.role, content: `${m.content.substring(0, 20)}...` })),
        model: githubModel
      }
    }));

    // Request data from GitHub AI models API (expects JSON)
    const githubResponse = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        messages,
        temperature: 0.7,
        top_p: 1.0,
        model: githubModel 
      })
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub API error:', githubResponse.status, errorText);
      // Send an error event to the client before closing
      res.write(`event: error\ndata: ${JSON.stringify({ error: `GitHub API Error (${githubResponse.status}): ${errorText}`, status: githubResponse.status })}\n\n`);
      res.end();
      return;
    }

    const githubData = await githubResponse.json();

    let completionText = '';
    // Try to extract content based on common structures; adjust if GitHub's actual structure differs
    if (githubData.choices && githubData.choices[0] && githubData.choices[0].message && githubData.choices[0].message.content) {
      completionText = githubData.choices[0].message.content;
    } else if (githubData.completion) { // Fallback for a simpler structure
        completionText = githubData.completion;
    } else if (typeof githubData.content === 'string') { // Another possible simple structure
        completionText = githubData.content;
    } else {
      console.error('Unexpected GitHub API response structure or empty content:', githubData);
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'Unexpected GitHub API response structure or empty content' })}\n\n`);
      res.end();
      return;
    }

    // Send the completion text to the client, simulating the OpenAI SSE stream format
    if (completionText) {
        // Send the entire completion as one data event, as the frontend accumulates deltas.
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: completionText } }] })}\n\n`);
    }
    
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error) {
    console.error('Streaming API error in /github/completions:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: error.message });
    } else {
        // Ensure error is stringified if it's an object
        const errorMessage = (typeof error.message === 'string') ? error.message : JSON.stringify(error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
    }
  }
});

// Route for OpenRouter models
router.post('/chat/completions', globalRateLimiter, moderateUserInput, async (req, res) => {
  try {
    const { model, messages, stream } = req.body;
    if (!model || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: model and messages are required.' });
    }

    res.setHeader('Content-Type', 'text-event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // OpenRouter might infer HTTP-Referer from the request for identification
        'HTTP-Referer': req.headers.origin || 'https://api.aimarker.tech',
        'X-Title': 'GCSE AI Marker' // Optional: For OpenRouter to identify your app
      },
      body: JSON.stringify({ model, messages, stream: stream !== undefined ? stream : true })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', openRouterResponse.status, errorText);
      res.write(`event: error\ndata: ${JSON.stringify({ error: `OpenRouter API Error (${openRouterResponse.status}): ${errorText}`, status: openRouterResponse.status })}\n\n`);
      res.end();
      return;
    }

    // Pipe the stream from OpenRouter to the client
    if (openRouterResponse.body) {
        const reader = openRouterResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            res.write(chunk); // Directly forward the chunk as OpenRouter SSE format is usually compatible
        }
    } else {
        // Fallback if no body or not streamable (should not happen with stream:true)
        const jsonData = await openRouterResponse.json();
        res.write(`data: ${JSON.stringify(jsonData)}\n\n`);
    }
    
    // OpenRouter streams usually end themselves, but ensure client knows.
    // Sending [DONE] might be redundant if OpenRouter already sends it.
    // Consider if client handles multiple [DONE] gracefully.
    // res.write(`data: [DONE]\n\n`); 
    res.end();

  } catch (error) {
    console.error('OpenRouter API error in /chat/completions:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: error.message });
    } else {
        const errorMessage = (typeof error.message === 'string') ? error.message : JSON.stringify(error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
    }
  }
});

// Route for Direct Gemini API (e.g., gemini-2.5-flash-preview-05-20)
router.post('/gemini/generate', globalRateLimiter, moderateUserInput, async (req, res) => {
  try {
    const { contents, generationConfig, model, system_instruction } = req.body; 
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Invalid request: contents array is required.' });
    }

    const geminiModel = model || 'gemini-2.5-flash-preview-05-20'; // Default to a specific Gemini model
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return res.status(500).json({ error: 'Gemini API key not configured on the server.' });
    }
    
    let requestBody = {
      contents,
      generationConfig: generationConfig || { temperature: 0.7, topP: 1.0 }, // Add default generationConfig if not provided
    };

    // Add system_instruction if provided
    if (system_instruction) {
      requestBody.system_instruction = system_instruction;
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    console.log('Sending request to Gemini API:', geminiApiUrl, JSON.stringify(requestBody).substring(0, 200) + '...');

    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      let parsedError = { message: `Gemini API Error (${geminiResponse.status})` };
      try {
        parsedError = JSON.parse(errorText).error || parsedError;
      } catch (e) { /* ignore if not JSON */ }
      return res.status(geminiResponse.status).json({ error: parsedError.message || errorText });
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini API response received successfully.');
    res.json(geminiData);

  } catch (error) {
    console.error('Gemini API error in /gemini/generate:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;