const { verifyToken } = require('../auth');

module.exports = function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
};
