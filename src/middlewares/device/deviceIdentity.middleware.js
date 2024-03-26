const jwt = require('jsonwebtoken');

/** Get device identitity */
module.exports = (req, res, next) => {
    /** validate device uuid */
    if(req.cookies['device_uuid'] == '') return res.json({ status: 500, message: 'Bad request' });
    res.locals.device = {
        device_uuid: req.cookies['device_uuid'],
        user_agent: req.headers['user-agent'],
        ip_address: req.connection.remoteAddress
    }
    next();
}

