const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
  } catch (error) {
    req.userData = null;
  }
  next();
};