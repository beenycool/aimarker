import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ 
      status: 'ok',
      openaiClient: true,
      apiKeyConfigured: true,
      timestamp: new Date().toISOString(),
      environment: 'local',
      rateLimited: false
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 