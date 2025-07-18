// backend/middleware/verifyToken.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const cookieToken = req.cookies.token;
  const headerToken = req.headers.authorization?.split(' ')[1];

  const token = cookieToken || headerToken;

  if (!token) {
    console.log('❌ No token found in cookies or headers');
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(403).json({ error: 'Forbidden - Invalid token' });
  }
};

module.exports = verifyToken;
