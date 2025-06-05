import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '../../../backend/src/models/User';
import { ActivityLog } from '../../../backend/src/models/ActivityLog';

interface SubmitRequestBody {
  question: string;
  subject: string;
  level: string;
}

interface SubmitResponse {
  submissionId: string;
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract token from headers
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const { question, subject, level }: SubmitRequestBody = req.body;
    
    // Validate input
    if (!question || question.length < 10) {
      return res.status(400).json({ error: 'Question must be at least 10 characters' });
    }

    // In a real implementation, this would call an AI service
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log the submission
    await ActivityLog.logActivity(
      user._id,
      'SUBMIT_QUESTION',
      { question, subject, level, submissionId },
      {
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        success: true
      }
    );

    res.status(200).json({
      submissionId,
      status: 'processing'
    });

  } catch (error: any) {
    console.error('Submission error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}