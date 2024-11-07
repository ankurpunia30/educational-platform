const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - Missing or improperly formatted token' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // Verify token using the shared JWT secret (must match the Auth service's secret)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data from token to the request object
        req.user = decoded;

        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = authMiddleware;
