const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Commented out
// const ActivityLog = require('../models/ActivityLog'); // Commented out

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    
    // Verify token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      
      // Check if user exists in database - This check needs to be removed or re-thought without a DB
      // const user = await User.findByPk(decoded.id); // Commented out
      // if (!user) { // Commented out
      //   return res.status(404).json({ success: false, message: 'User not found' }); // Commented out
      // } // Commented out
      
      // Attach user to request object
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      };
      
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Middleware to check admin permissions
// const isAdmin = async (req, res, next) => { // Commented out
//   try { // Commented out
//     if (req.user.role !== 'admin') { // Commented out
//       // Log unauthorized access attempt // Commented out
//       // await ActivityLog.create({ // Commented out
//       //   userId: req.user.id, // Commented out
//       //   username: req.user.username, // Commented out
//       //   actionType: 'admin_action', // Commented out
//       //   actionDetails: { // Commented out
//       //     action: 'unauthorized_access', // Commented out
//       //     endpoint: req.originalUrl // Commented out
//       //   }, // Commented out
//       //   performedAt: new Date() // Commented out
//       // }); // Commented out
      
//       return res.status(403).json({ success: false, message: 'Access denied. Admin permissions required.' }); // Commented out
//     } // Commented out
    
//     next(); // Commented out
//   } catch (error) { // Commented out
//     console.error('Admin check error:', error); // Commented out
//     res.status(500).json({ success: false, message: 'Server error', error: error.message }); // Commented out
//   } // Commented out
// }; // Commented out

// Middleware to attach request metrics
const attachRequestMetrics = (req, res, next) => {
  req.metrics = {
    startTime: Date.now(),
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };
  
  // Log metrics after response
  res.on('finish', async () => {
    if (req.user) {
      const duration = Date.now() - req.metrics.startTime;
      
      // Log API calls that take longer than 500ms
      if (duration > 500) {
        console.warn(`Slow API call: ${req.method} ${req.path} took ${duration}ms`);
        
        // Log to database if user is authenticated - This needs to be removed
        // try { // Commented out
        //   await ActivityLog.create({ // Commented out
        //     userId: req.user.id, // Commented out
        //     username: req.user.username, // Commented out
        //     actionType: 'other', // Commented out
        //     actionDetails: { // Commented out
        //       action: 'slow_api_call', // Commented out
        //       method: req.method, // Commented out
        //       path: req.path, // Commented out
        //       duration, // Commented out
        //       statusCode: res.statusCode // Commented out
        //     }, // Commented out
        //     performedAt: new Date() // Commented out
        //   }); // Commented out
        // } catch (error) { // Commented out
        //   console.error('Error logging slow API call:', error); // Commented out
        // } // Commented out
      }
    }
  });
  
  next();
};

module.exports = {
  authenticateToken,
  // isAdmin, // Removed
  attachRequestMetrics
}; 