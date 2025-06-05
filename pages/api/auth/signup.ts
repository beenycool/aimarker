import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../../../backend/src/models/User';
import { ActivityLog } from '../../../backend/src/models/ActivityLog';

// Types for request and response
interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
}

interface SignupResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Connect to MongoDB if not already connected
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beenycool');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { username, email, password }: SignupRequestBody = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Username, email, and password are required' 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        error: 'Invalid username',
        details: 'Username must be at least 3 characters long' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Invalid password',
        details: 'Password must be at least 6 characters long' 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(409).json({ error: 'Email already registered' });
      } else {
        return res.status(409).json({ error: 'Username already taken' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Log the signup activity
    await ActivityLog.logActivity(
      savedUser._id,
      'LOGIN',
      { action: 'signup', username },
      {
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        success: true
      }
    );

    // Return user data without password
    const userResponse = savedUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      user: userResponse,
      token
    });

  } catch (error: any) {
    console.error('Signup error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}