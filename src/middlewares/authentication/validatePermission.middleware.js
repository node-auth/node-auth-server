module.exports.validatePermission = (permissions) => {
    return (req, res, next) => {
        let isPemitted = true;
        for(let i = 0; i < permissions.length; i++) {
            const checkPermission = req.user.permissions[process.env.BASE_URL].includes(permissions[i]);
            if(!checkPermission) {
                isPemitted = false;
                break;
            }
        }
        if(!isPemitted) return res.status(401).json({ error: 'Unauthorize' });
        next();
    }
}

