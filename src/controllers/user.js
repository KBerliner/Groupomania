const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs/promises');
const db = require('../db');

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
        { userId: user.id },
        'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867',
        { expiresIn: '2h' }
      );

      // Use parameterized query to prevent SQL injection
      const values = [user.id, user.username, user.email, user.password];
      const sql = `INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)`;

      console.log("SQL Query:", sql);
      console.log("Values:", values);

      db.query(sql, values).then(
        () => {
          res.status(201).json({
            message: 'User added successfully!',
            username: req.body.username,
            userId: user.id,
            token: token
          });
        }
      ).catch(
        (error) => {
          console.error("Query Error:", error);
          res.status(500).json({
            error: error
          });
        }
      )
    }
  )
};

// The "Login" Function

exports.login = (req, res, next) => {

  const values = [req.body.email];
  const sql = `SELECT * FROM users WHERE email = $1;`;

  db.query(sql, values).then(
        (result) => {
          
          console.log(result);
          if (!result || result.rows.length === 0) {
            return res.status(401).json({
              error: new Error('User not found!')
            });
          }

          const user = result.rows[0];

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
                    { userId: user.id },
                    'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867',
                    { expiresIn: '30d' }
                  );
                } else if (!req.body.remember) {
                  token = jwt.sign(
                    { userId: user.id },
                    'quw78q3465yrt8q3b82fysdfgut34867q3rwey84867',
                    { expiresIn: '2h' }
                  );
                }

                res.status(200).json({
                    userId: user.id,
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
    console.log('TRYING');
    // Find all posts by authorId
    const sql = 'SELECT * FROM posts WHERE authorid = $1';

    const values = [req.params.id];
    const retrievePosts = await db.query(sql, values);
    let posts;
    if (retrievePosts.rows.length !== 0) {
      posts = retrievePosts.rows;
    }

    // Delete posts and associated images
    for (const post of posts) {
      console.log('TRYING MORE')
      let filename;
      if (post.image && post.image !== null) {
        filename = post.image.split('/images/')[1];
        await fs.unlink('images/' + filename);
      }
      console.log(filename)
      const deleteonesql = 'DELETE FROM posts WHERE id = $1'
      const deletevalues = [post.id];
      
      await db.query(deleteonesql, deletevalues);
      console.log('DONE');
    }

    // Delete posts based on authorId
    const deletesql = 'DELETE FROM posts WHERE authorid = $1';
    const deletevalues = [req.params.id]
    await db.query(deletesql, deletevalues);

    // Delete user
    const deleteusersql = 'DELETE FROM users WHERE id = $1'
    await db.query(deleteusersql, deletevalues);

    res.status(200).json({
      message: 'Deleted!'
    });
  } catch (error) {
    res.status(400).json({
      error: error
    });
  }
}

// The "Edit" Function

exports.editProfile = (req, res, next) => {
  try {
    console.log('REQUEST BODY: ', req.body, req.params.id);

    const sql = 'UPDATE users SET username = $1 WHERE id = $2';
    const values = [req.body.username, req.params.id];

    db.query(sql, values).then(
      () => {
        res.status(200).json({
          username: req.body.username
        })
      }

    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        })
      }
    )
  } catch (error) {
    res.status(400).json({
      error: "ERROR"
    })
  }
}