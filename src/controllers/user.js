const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');

// The "Signup" Function

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'User added successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

// The "Login" Function

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(
        (user) => {
          if (!user) {
            return res.status(401).json({
              error: new Error('User not found!')
            });
          }
          bcrypt.compare(req.body.password, user.password).then(
            (valid) => {
                if (!valid) {
                  return res.status(401).json({
                    error: new Error('Incorrect password!')
                  });
                }
                const token = jwt.sign(
                    { userId: user._id },
                    'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867',
                    { expiresIn: '24h' }
                );
                // user = {
                //   username: user.username,
                //   email: user.email,
                //   password: user.password,
                //   token: token
                // }
                // user.save();
                res.status(200).json({
                    userId: user._id,
                    token: token,
                    username: user.username
                });
            }
          ).catch(
            (error) => {
              res.status(500).json({
                error: error
              });
            }
          );
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
}

// The "Delete" Function

exports.delete = (req, res, next) => {
  Post.deleteMany({ creatorId: req.params.id}).then(
    (posts) => {
      console.log(posts);
      console.log(req.params.id);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  );
  User.findOne({ userId: req.body.params }).then(
    (user) => {
      User.deleteOne({ userId: req.params.userId }).then(
        () => {
          res.status(200).json({
            message: 'Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    });
}