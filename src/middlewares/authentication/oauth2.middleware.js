const jwt = require('jsonwebtoken');

module.exports.oauth2Middleware = (oauthType) => {
    return (req, res, next) => {
        /** Token */
        if(oauthType == 'token') {
            /** Get response type */
            if(!req.body.grant_type) return res.status(401).json({ error: 'Missing token' });
            /** Validate token */
            if(req.body.grant_type == 'authorization_code') {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
                if (!token) {
                    return res.status(401).json({ error: 'Invalid request' });
                }
                // Verify the token
                jwt.verify(token, process.env.JWT_PUBLIC_KEY, (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ error: 'Invalid request' });
                    }
                    /** Validate audience */
                    if(decoded.aud != process.env.JWT_AUDIENCE) return res.status(401).json({ error: 'Invalid request' });
                    /** Validate issuer */
                    if(decoded.iss != process.env.JWT_ISSUER) return res.status(401).json({ error: 'Invalid request' });
                    req.user = decoded;
                    next();
                });
            } else {
                next();
            }
        } else {
            next();
        }
    }
}