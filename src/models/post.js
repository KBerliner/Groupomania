// Installing Dependencies

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint for the "Post" object

const postSchema = mongoose.Schema({
    title: {
        type: String,
        default: ''
        // required: true
        },
    author: {
        type: String,
        default: ''
    },
    authorId: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
        // required: true
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    usersLiked: {
        type: Array
    },
    usersDisliked: {
        type: Array
    },
    usersSeen: {
        type: Array
    },
    image: {}
});

postSchema.plugin(uniqueValidator);

// Exporting the Post Blueprint

module.exports = mongoose.model('Post', postSchema);