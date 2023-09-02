// Importing Dependencies

const Persist = require('../models/persist');
const User = require('../models/user');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// The "Persist" Function

exports.persist = (req, res, next) => {
    const token = req.body.key;

    try {
        const decodedToken = jwt.verify(token, 'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867');

        console.log(decodedToken);

        const values = [decodedToken.userId];
        const sql = `SELECT * FROM users WHERE id = $1`;

        db.query(sql, values).then(
            (result) => {
                if (result.rows.length === 0) {
                    res.status(404).json({ message: 'User not found!' });
                    return;
                }

                const user = result.rows[0]

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

        // Token is valid, continue processing
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Handle token expiration
                console.log('Token has expired');
                // Perform any necessary actions, such as logging the user out
                res.status(400).json({
                    message: 'Session has expired'
                })
            } else {
                // Handle other JWT errors
                console.log('JWT error:', error.message);
            }
        }
};