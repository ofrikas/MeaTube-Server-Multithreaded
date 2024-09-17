const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    let token;
    // Check Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }
    // If not in header, check body
    else if (req.body && req.body.token) {
      token = req.body.token.split(' ')[1];
    }
    // If not in body, check query
    else if (req.query && req.query.token) {
      token = req.query.token.split(' ')[1];
    }

    if (!token) {
      throw new Error('No token found');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};