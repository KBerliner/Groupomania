// Importing Dependencies

const Post = require('../models/post');
const fs = require('fs');
const db = require('../db');

// The "See" Function

exports.see = (req, res, next) => {
    const sql = ('UPDATE posts SET usersseen = $1 WHERE id = $2');
    const sqlUsersSeen = `{ "${req.body.usersSeen.join('", "')}" }`;
    const sqlId = parseInt(req.params.id);
    const values = [sqlUsersSeen, sqlId];

    db.query(sql, values).then(
        () => {
            res.status(201).json({
                message: 'Seen!',
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
}

// The "Like" and "Dislike" Function

exports.likePost = (req, res, next) => {
    const findsql = 'SELECT * FROM posts WHERE id = $1';
    const values = [req.params.id];

    db.query(findsql, values).then(
        (result) => {
            if (result.rows.length === 0) {
                res.status(404).json({
                    message: 'Post Not Found!'
                })
            };

            const post = result.rows[0];
            let updatesql;
            let sqlarray;
            let updatevalues = [];

            if (req.body.like == 1) {
                post.likes++;
                post.usersliked.push(req.body.userId)
                updatesql = 'UPDATE posts SET usersliked = $1, likes = $2 WHERE id = $3';
                sqlarray = `{ "${post.usersliked.join('", "')}" }`;
                updatevalues = [sqlarray, post.likes, req.params.id];
            } else if (req.body.like == -1) {
                post.dislikes++;
                post.usersdisliked.push(req.body.userId);
                updatesql = 'UPDATE posts SET usersdisliked = $1, dislikes = $2 WHERE id = $3';
                updatevalues = [`{ "${post.usersdisliked.join('", "')}" }`, post.dislikes, req.params.id];
            } else {
                if (post.usersliked.includes(req.body.userId)) {
                    let idKeyStart = post.usersliked.indexOf(req.body.userId);
                    let idKeyEnd = idKeyStart + 1;
                    post.usersliked.splice(idKeyStart, idKeyEnd);
                    post.likes--;
                    updatesql = 'UPDATE posts SET usersliked = $1, likes = $2 WHERE id = $3';
                    updatevalues = [`{ "${post.usersliked.join('", "')}" }`, post.likes, req.params.id];
                } else if (post.usersdisliked.includes(req.body.userId)) {
                    let idKeyStart = post.usersdisliked.indexOf(req.body.userId);
                    let idKeyEnd = idKeyStart + 1;
                    post.usersdisliked.splice(idKeyStart, idKeyEnd);
                    post.dislikes--;
                    updatesql = 'UPDATE posts SET usersdisliked = $1, dislikes = $2 WHERE id = $3';
                    updatevalues = [`{ "${post.usersdisliked.join('", "')}" }`, post.dislikes, req.params.id];
                };
            };
            db.query(updatesql, updatevalues).then(
                () => {
                    res.status(200).json({
                        message: 'Success!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    })
                }
            )
        }
    )
};

// The "Create" Function

exports.createPost = (req, res, next) => {
    const sql = 'INSERT INTO posts (author, authorid, title, caption, likes, dislikes, image, likesenabled, usersliked, usersdisliked, usersseen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);';
    

    const url = req.protocol + '://' + req.get('host');
    const postBody = JSON.parse(req.body.post);
    if (req.file) {
        const post = new Post({
            title: postBody.title,
            author: postBody.author,
            caption: postBody.caption,
            authorId: postBody.authorId,
            image: url + '/' + req.file.path,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            usersSeen: [],
            likesEnabled: postBody.likesEnabled
        });
        const values = [post.author, post.authorId, post.title, post.caption, post.likes, post.dislikes, post.image, post.likesEnabled, '{}', '{}', '{}'];
        db.query(sql, values).then(
            () => {
                res.status(201).json({
                    message: 'Created!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                })
            }
        );
    } else {
        const post = new Post({
            title: postBody.title,
            author: postBody.author,
            caption: postBody.caption,
            authorId: postBody.authorId,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            likesEnabled: postBody.likesEnabled
        });
        const values = [post.author, post.authorId, post.title, post.caption, post.likes, post.dislikes, null, post.likesEnabled, '{}', '{}', '{}'];
        db.query(sql, values).then(
            () => {
                res.status(201).json({
                    message: 'Created!',
                    message: req.body
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                })
            }
        );
    };
};

// The function to retrieve ONE post

exports.getOnePost = (req, res, next) => {

    const sql = 'SELECT * FROM posts WHERE id = $1';
    const values = [req.params.id];

    db.query(sql, values).then(
        (result) => {
            if (result.rows.length === 0) {
                res.status(400).json({
                    error: error
                })
            }
            res.status(200).json(result.rows[0])
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    );
}

// The function to update ONE post

exports.updatePost = (req, res, next) => {
    const sql = 'SELECT * FROM posts WHERE id = $1';
    const values = [req.params.id];
    let post = new Post({ id: req.params.id });
    const postBody = JSON.parse(req.body.post);
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        post = {
            title: postBody.title,
            author: postBody.author,
            caption: postBody.caption,
            image: url + '/' + req.file.path
        };
        db.query(sql, values).then(
            (result) => {
                if (result.rows.length !== 0 && result.rows[0].image) {
                    const filename = result.rows[0].image.split('/images/')[1];
                    fs.unlink('images/' + filename, () => {
                        console.log('Image Deleted!');
                    });
                }
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        )
    } else {
        post = {
            title: postBody.title,
            caption: postBody.caption,
            image: postBody.image
        };
    }

    const updatesql = 'UPDATE posts SET title = $1, caption = $2, image = $3 WHERE id = $4';
    const updatevalues = [post.title, post.caption, post.image, req.params.id];

    db.query(updatesql, updatevalues).then(
        () => {
            res.status(201).json({
                message: 'Post updated successfully!'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// The "Delete" Function

exports.deletePost = (req, res, next) => {
    const findsql = 'SELECT * FROM posts WHERE id = $1';
    const deletesql = 'DELETE FROM posts WHERE id = $1';
    const values = [req.params.id];

    db.query(findsql, values).then(
        (result) => {
            if (!result || result.rows.length === 0) {
                return res.status(404).json({
                    error: new Error('No such thing!')
                });
            }
            if (result.rows[0].authorid !== req.auth.userId) {
                return res.status(400).json({
                    error: new Error('Unauthorized request!')
                });
            }
        }
    )
    db.query(findsql, values).then(
        (result) => {
            const post = result.rows[0];
            if (post.image) {
                const filename = post.image.split('/images/')[1];
                fs.unlink('images/' + filename, () => {
                    db.query(deletesql, values).then(
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
            } else {
                db.query(deletesql, values).then(
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
            }
        }
    );
}

// The function to delete all specific posts

exports.deleteThese = (req, res, next) => {
    const sql = 'DELETE FROM posts WHERE authorid = $1;';
    const values = [req.params.authorId];

    db.query(sql, values).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
}

// The function to retrieve ALL posts

exports.allPosts = (req, res, next) => {
    db.query('SELECT * FROM posts').then(
        (results) => {
            res.status(200).json(results.rows);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
};