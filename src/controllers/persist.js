// Importing Dependencies

const Persist = require('../models/persist');
const User = require('../models/user');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// The "Persist" Function

exports.persist = (req, res, next) => {
    // console.log('REQUEST LOG: ', req);
    const token = req.body.key;
    const decodedToken = jwt.verify(token, 'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867');
    
    User.findOne({ _id: decodedToken.userId }).then(
        (user) => {
            // console.log(decodedToken.userId + ' ' + user);
            res.status(200).json({
                userId: decodedToken.userId,
                username: user.username,
                token: token,
                message: 'All good'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
    if (decodedToken) {

    } else {

    }
    // req.auth = { userId };
    // if (req.body.userId && req.body.userId !== userId) {
    //     throw 'Invalid user ID';
    // } else {
    //     res.status(200).json({
    //         message: "Valid User ID"
    //     });
    // }
};