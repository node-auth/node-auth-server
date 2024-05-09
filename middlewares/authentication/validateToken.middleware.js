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
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256']
    }, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403); // Forbidden
        }
        console.log(user);
        req.user = user;
        next();
    });
}