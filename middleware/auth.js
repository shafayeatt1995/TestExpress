const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const { id, email } = decode;
        req.email = email;
        req.userId = id;
        next();
    } catch (error) {
        next('Authentication Fail');
    }
};

module.exports = authCheck;
