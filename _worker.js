export default {
  async fetch(request, env, ctx) {
    // Allow Cloudflare Pages to handle the request for static assets
    return env.ASSETS.fetch(request);
  },
}; 