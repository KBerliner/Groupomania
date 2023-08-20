// Installing Dependencies

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint for the "User" object

const userSchema = mongoose.Schema({
    "username": {type: String, required: true, unique: true},
    "email": { type: String, required: true, unique: true },
    "password": { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Exporting the User blueprint

module.exports = mongoose.model('User', userSchema);