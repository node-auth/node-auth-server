const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    /** Check token existence */
    if (token == null) {
        return res.status(401).json({ error: 'Unauthorize' });
    }
    /** Validate token */
    jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
        audience: req.headers['user-agent'] ?? process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256']
    }, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}