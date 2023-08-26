const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs/promises');

// The "Signup" Function

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            let token = jwt.sign(
              { userId: user._id },
              'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867',
              { expiresIn: '2h' }
            );
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'User added successfully!',
                        username: req.body.username,
                        userId: user._id,
                        token: token
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
                let token;
                if (req.body.remember) {
                  token = jwt.sign(
                    { userId: user._id },
                    'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867',
                    { expiresIn: '30d' }
                  );
                } else if (!req.body.remember) {
                  token = jwt.sign(
                    { userId: user._id },
                    'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867',
                    { expiresIn: '2h' }
                  );
                }

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

exports.delete = async (req, res, next) => {
  try {
    // Find all posts by authorId
    const posts = await Post.find({ authorId: req.params.id });

    // Delete posts and associated images
    for (const post of posts) {
      const filename = post.image.split('/images/')[1];
      await fs.unlink('images/' + filename);
      await Post.deleteOne({ _id: post._id });
    }

    // Delete posts based on authorId
    await Post.deleteMany({ authorId: req.params.id });

    // Delete user
    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message: 'Deleted!'
    });
  } catch (error) {
    res.status(400).json({
      error: error
    });
  }

}

