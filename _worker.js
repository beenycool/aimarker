export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Check if this is a request for a static asset
    if (url.pathname.startsWith('/_next/') || 
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.css') || 
        url.pathname.endsWith('.ico') || 
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.svg')) {
      try {
        // Let Cloudflare handle static assets
        return await env.ASSETS.fetch(request);
      } catch (error) {
        console.error('Error serving static asset:', error);
        return new Response('Static asset not found', { status: 404 });
      }
    }
    
    try {
      // For all other routes, serve the index.html file
      // This enables client-side routing
      const indexRequest = new Request(`${url.origin}/index.html`, {
        headers: request.headers,
        method: 'GET'
      });
      
      const response = await env.ASSETS.fetch(indexRequest);
      
      // Return the response with appropriate headers
      return new Response(response.body, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        status: 200,
      });
    } catch (error) {
      console.error('Error serving index.html:', error);
      
      // Fallback to a simple HTML response
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>GCSE AI Marker</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; text-align: center; }
            h1 { margin-top: 40px; }
          </style>
        </head>
        <body>
          <h1>GCSE AI Marker</h1>
          <p>Loading application...</p>
        </body>
        </html>
      `, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
        status: 200
      });
    }
  },
}; 