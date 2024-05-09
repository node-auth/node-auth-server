module.exports.validatePermission = (permissionList) => {
    return (req, res, next) => {
        try {
            let isPermitted = true;
            const userPermissions = req.user.permissions?.[process.env.BASE_URL];
            if (!userPermissions) {
                return res.status(401).json({ success: false, message: 'Unauthorize' });
            }
            for (let i = 0; i < permissionList.length; i++) {
                const checkPermission = userPermissions.includes(permissionList[i]);
                if (!checkPermission) {
                    isPermitted = false;
                    break;
                }
            }
            if (!isPermitted) return res.status(401).json({ success: false, message: 'Unauthorize' });
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Unauthorize' });
        }
    }
}

