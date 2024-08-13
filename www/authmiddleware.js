const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, 'sv7ykYqJl_Z_r0bvuO-V_uj8MYnWptoWZGMGshiGTRrkPDh8MeLc8orgECrerl_B', (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = decoded; // Attach user data to the request
      next();
    });
  };

module.exports = authenticateToken;