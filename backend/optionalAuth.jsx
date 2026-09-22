const jwt = require('jsonwebtoken');

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.userId = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET).userId;
    } catch (err) {}
  }
  next();
}

module.exports = optionalAuth;