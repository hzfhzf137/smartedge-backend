// backend/middleware/verifyToken.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    console.log('❌ No token found in cookies or headers');
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Support both approaches (cookie & header-based)
    req.user = decoded;
    req.userId = decoded.id; // 👈 hybrid fix for old routes using req.userId

    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(403).json({ error: 'Forbidden - Invalid token' });
  }
};

module.exports = verifyToken;
