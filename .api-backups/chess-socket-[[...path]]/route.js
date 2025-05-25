
import { NextResponse } from 'next/server';

// This is a placeholder file for Cloudflare Pages build
// The real file will be restored after build

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [];
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Chess API placeholder for Cloudflare build' 
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Chess API placeholder for Cloudflare build' 
  });
}

export async function OPTIONS() {
  return NextResponse.json({});
}
