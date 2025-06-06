export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Handle API routes - proxy to backend
  if (url.pathname.startsWith('/api/')) {
    const backendUrl = `https://api.aimarker.tech${url.pathname}${url.search}`;
    
    return fetch(backendUrl, {
      method: context.request.method,
      headers: context.request.headers,
      body: context.request.body,
    });
  }
  
  // For all other routes, serve static files
  return context.next();
}