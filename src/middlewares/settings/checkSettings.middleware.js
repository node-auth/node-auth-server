module.exports.checkSettings = (settings) => {
    return (req, res, next) => {
        /** validate if service is enabled */
        let isEnabled = true;
        for(let i = 0; i < settings.length; i++) {
            if(process.env[settings[i]] == "false") {
                isEnabled = false;
                break;
            }
        }
        if(!isEnabled) return res.status(400).json({ error: 'This service is disabled' });
        next();
    }
}