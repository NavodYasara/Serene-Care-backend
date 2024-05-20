const jwt = require('jsonwebtoken');

function authenticateUser(requiredUserType) {
  return (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the token is set to the hardcoded admin token
    if (token === 'hardcoded_admin_token') {
      req.user = { user_type: 'Admin' };
      return next();
    }

    jwt.verify(token, 'your_jwt_secret_here', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if the user type is "Admin" or the required user type
      if (decoded.user_type !== 'Admin' && decoded.user_type !== requiredUserType) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = authenticateUser;