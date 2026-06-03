const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Check if token is present in headers
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access Denied. Pehle login karein.' });

    try {
        // Verify the token
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.admin = verified;
        next(); // Token sahi hai toh aage jane do
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};