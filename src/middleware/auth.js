// Installing Dependencies

const jwt = require('jsonwebtoken');

// Exporting the authorization function

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867');
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch  {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};