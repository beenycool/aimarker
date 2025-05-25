
// Static version of the chess-socket API for Cloudflare Pages
export const dynamic = 'force-static';

export function generateStaticParams() {
  return [];
}

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Chess API is available via the backend",
      status: "Static export for Cloudflare Pages",
      endpoint: "/api/chess-socket"
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function POST() {
  return new Response(
    JSON.stringify({
      message: "Chess API is available via the backend",
      status: "Static export for Cloudflare Pages",
      endpoint: "/api/chess-socket"
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
