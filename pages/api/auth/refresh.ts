import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '../../../backend/src/models/User';
import { ActivityLog } from '../../../backend/src/models/ActivityLog';

interface RefreshRequestBody {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefreshResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refreshToken }: RefreshRequestBody = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify the refresh token
    const payload: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret');
    
    // Check if user exists
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '15m' }
    );

    // Log the token refresh activity
    await ActivityLog.logActivity(
      user._id,
      'REFRESH_TOKEN',
      {},
      {
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        success: true
      }
    );

    res.status(200).json({ accessToken });

  } catch (error: any) {
    console.error('Token refresh error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}