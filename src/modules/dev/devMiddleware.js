module.exports.validateAPIKEY = (req, res, next) => {
    if(process.env.DEVELOPER_MODE_ENABLED == 'false') return res.status(400).json({ error: 'Invalid request' });
    const apiKey = req.headers['x-developer-key'];
    if(apiKey == process.env.DEV_API_KEY) return res.status(401).json({ error: 'Unauthorize' });
    next();
}