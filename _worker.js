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
      // Let Cloudflare handle static assets
      return env.ASSETS.fetch(request);
    }
    
    // For all other routes, serve the index.html file
    // This enables client-side routing
    const response = await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
    
    // Return the response with appropriate headers
    return new Response(response.body, {
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      status: url.pathname === '/' ? 200 : response.status,
    });
  },
}; 