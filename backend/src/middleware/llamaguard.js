const fetch = require('node-fetch');

/**
 * LlamaGuard Content Moderation Middleware using Cloudflare Workers AI
 * Provides safety checks for educational content in the GCSE AI Marker
 * Free tier: 10,000 neurons/day
 */
class LlamaGuard {
  constructor() {
    this.cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
    this.model = '@cf/meta/llama-guard-7b'; // Cloudflare's LlamaGuard model
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.cloudflareAccountId}/ai/run/${this.model}`;
    
    // Educational content safety guidelines for GCSE context
    this.safetyGuidelines = `
You are a content moderator for an educational AI system used by GCSE students and teachers.

SAFE content includes:
- Academic questions about GCSE subjects (Math, Science, English, History, etc.)
- Requests for homework help or explanation of concepts
- Educational discussions and constructive feedback
- Learning materials and study resources
- Appropriate questions about exam preparation

UNSAFE content includes:
- Violence, harassment, or bullying
- Inappropriate sexual content
- Hate speech or discrimination
- Self-harm or dangerous activities
- Cheating or academic dishonesty requests
- Spam or irrelevant content
- Personal attacks or offensive language

Respond with only "SAFE" or "UNSAFE" followed by a brief reason.
`;
  }

  /**
   * Check if Cloudflare Workers AI is configured
   */
  isConfigured() {
    return !!(this.cloudflareAccountId && this.cloudflareApiToken);
  }

  /**
   * Create the moderation prompt for LlamaGuard
   */
  createModerationPrompt(content, isUserInput = true) {
    const contentType = isUserInput ? 'student/teacher input' : 'AI response';
    
    return `${this.safetyGuidelines}

Content to evaluate (${contentType}):
"${content}"

Classification:`;
  }

  /**
   * Moderate content using LlamaGuard via Cloudflare Workers AI
   */
  async moderateContent(content, isUserInput = true) {
    if (!this.isConfigured()) {
      console.warn('LlamaGuard: Cloudflare Workers AI not configured, skipping moderation');
      return { safe: true, reason: 'moderation_disabled' };
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return { safe: true, reason: 'empty_content' };
    }

    try {
      const prompt = this.createModerationPrompt(content, isUserInput);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.cloudflareApiToken}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a content safety classifier for educational content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.1 // Low temperature for consistent classification
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LlamaGuard: Cloudflare Workers AI error:', response.status, errorText);
        
        // Fail open - allow content if moderation service is down
        return { 
          safe: true, 
          reason: 'moderation_service_error',
          error: `Cloudflare Workers AI error: ${response.status}`
        };
      }

      const data = await response.json();
      
      // Cloudflare Workers AI response format
      const result = data.result?.response || data.response || '';
      const classification = result.trim().toLowerCase();
      
      const isSafe = classification.startsWith('safe') || 
                    (!classification.includes('unsafe') && !classification.includes('violation'));
      
      // Extract reason from the classification
      let reason = 'content_approved';
      if (!isSafe) {
        reason = 'content_flagged';
        // Try to extract specific reason from the response
        if (classification.includes('violence')) reason = 'violence_detected';
        else if (classification.includes('harassment')) reason = 'harassment_detected';
        else if (classification.includes('inappropriate')) reason = 'inappropriate_content';
        else if (classification.includes('spam')) reason = 'spam_detected';
      }

      return {
        safe: isSafe,
        reason: reason,
        classification: result,
        flaggedFor: isUserInput ? 'user_input' : 'ai_response',
        service: 'cloudflare_workers_ai'
      };

    } catch (error) {
      console.error('LlamaGuard: Moderation error:', error);
      
      // Fail open - allow content if there's an error
      return { 
        safe: true, 
        reason: 'moderation_error',
        error: error.message,
        service: 'cloudflare_workers_ai'
      };
    }
  }

  /**
   * Express middleware for moderating user input
   */
  async moderateUserInput(req, res, next) {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return next();
      }

      // Check the last user message
      const userMessages = messages.filter(msg => msg.role === 'user');
      if (userMessages.length === 0) {
        return next();
      }

      const lastUserMessage = userMessages[userMessages.length - 1];
      const moderationResult = await this.moderateContent(lastUserMessage.content, true);

      if (!moderationResult.safe) {
        console.warn('LlamaGuard: Unsafe user input detected:', {
          classification: moderationResult.classification,
          reason: moderationResult.reason,
          service: moderationResult.service
        });

        // Provide educational-focused error message
        let errorMessage = 'Your message contains content that may not be appropriate for an educational environment.';
        
        switch (moderationResult.reason) {
          case 'violence_detected':
            errorMessage = 'Please keep your questions focused on academic topics appropriate for GCSE studies.';
            break;
          case 'harassment_detected':
            errorMessage = 'Please maintain respectful language in your educational queries.';
            break;
          case 'inappropriate_content':
            errorMessage = 'Please ensure your question is appropriate for a classroom setting.';
            break;
          case 'spam_detected':
            errorMessage = 'Please ask specific, educational questions related to your GCSE studies.';
            break;
          default:
            errorMessage = 'Please revise your question to focus on educational content appropriate for GCSE studies.';
        }

        return res.status(400).json({
          error: 'Content Policy Violation',
          message: errorMessage,
          code: 'CONTENT_MODERATION_FAILED',
          details: {
            reason: moderationResult.reason,
            flaggedFor: moderationResult.flaggedFor,
            service: moderationResult.service
          }
        });
      }

      // Content is safe, continue
      req.moderationResult = moderationResult;
      next();

    } catch (error) {
      console.error('LlamaGuard: Middleware error:', error);
      // Continue on error to avoid breaking the application
      next();
    }
  }

  /**
   * Moderate AI response before sending to user
   */
  async moderateAIResponse(content) {
    return await this.moderateContent(content, false);
  }

  /**
   * Get moderation statistics
   */
  getModerationStats() {
    return {
      service: 'cloudflare_workers_ai',
      model: this.model,
      configured: this.isConfigured(),
      dailyLimit: '10,000 neurons',
      costPerRequest: 'Free tier'
    };
  }
}

// Create singleton instance
const llamaGuard = new LlamaGuard();

// Export middleware function
const moderateUserInput = async (req, res, next) => {
  await llamaGuard.moderateUserInput(req, res, next);
};

module.exports = {
  LlamaGuard,
  llamaGuard,
  moderateUserInput
};