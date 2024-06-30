
const jwt = require('jsonwebtoken');
const config = require("../config");

function authenticateToken(req, res, next) {

    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, config.user.hash);
        req.user = verified;
        next(); 
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

module.exports = authenticateToken;
