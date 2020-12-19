const jwt = require('jsonwebtoken');

exports.ensure_superAdmin_permission = (req, res, next) => {
    console.log(req.headers);
    try {
        const token = req.headers.authorization || "";
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log(decoded);
        if( decoded.userRole === 'SuperAdmin'){
            req.userData = decoded;
            console.log(decoded);
            next();

        }else {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};