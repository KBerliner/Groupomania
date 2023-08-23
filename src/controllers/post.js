// Importing Dependencies

const Post = require('../models/post');
const fs = require('fs');

// The "See" Function

exports.see = (req, res, next) => {
    Post.findOne({ _id: req.params.id }).then(
        (post) => {
            post.usersSeen.push(req.body.userId);
            Post.updateOne({ _id: req.params.id }, post).then(
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
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    )
}

// The "Like" and "Dislike" Function

exports.likePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id }).then(
        (post) => {
            if (req.body.like == 1) {
                    post.likes++;
                    post.usersLiked.push(req.body.userId);
            } else if (req.body.like == -1) {
                post.dislikes++;
                post.usersDisliked.push(req.body.userId);
            } else {
                
                    if (post.usersLiked.includes(req.body.userId)) {
                        let idKeyStart = post.usersLiked.indexOf(req.body.userId);
                        let idKeyEnd = idKeyStart + 1;
                        post.usersLiked.splice(idKeyStart, idKeyEnd);
                        post.likes--;
                    } else if (post.usersDisliked.includes(req.body.userId)) {
                        let idKeyStart = post.usersDisliked.indexOf(req.body.userId);
                        let idKeyEnd = idKeyStart + 1;
                        post.usersDisliked.splice(idKeyStart, idKeyEnd);
                        post.dislikes--;
                    };
            };
            Post.updateOne({ _id: req.params.id }, post).then(
                () => {
                    res.status(201).json({
                        message: 'Liked!'
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
    );
};

// The "Create" Function

exports.createPost = (req, res, next) => {
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
            likesEnabled: postBody.likesEnabled
        });
        post.save().then(
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
        post.save().then(
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
    Post.findOne({
        _id: req.params.id
    }).then(
        (post) => {
            res.status(200).json(post)
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
    let post = new Post({ _id: req.params.id });
    const postBody = JSON.parse(req.body.post);
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        post = {
            title: postBody.title,
            author: postBody.author,
            caption: postBody.caption,
            image: url + '/' + req.file.path,
        };
        Post.findOne({ _id: req.params.id }).then(
            (post) => {
                const filename = post.image.split('/images/')[1];
                fs.unlink('images/' + filename, () => {
                    console.log('Image Deleted!');
                });
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

    Post.updateOne({ _id: req.params.id }, post).then(
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
    
    Post.findOne({ _id: req.params.id }).then(
        (post) => {
            if (!post) {
                return res.status(404).json({
                    error: new Error('No such thing!')
                });
            }
            if (post.authorId !== req.auth.userId) {
                return res.status(400).json({
                    error: new Error('Unauthorized request!')
                });
            }
        }
    )
    Post.findOne({ _id: req.params.id }).then(
        (post) => {
            const filename = post.image.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Post.deleteOne({ _id: req.params.id }).then(
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
    );
}

// The function to delete all specific posts

exports.deleteThese = (req, res, next) => {
    Post.deleteMany({ authorId: req.params.authorId }).then(
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
    Post.find().then(
        (posts) => {
            res.status(200).json(posts);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};