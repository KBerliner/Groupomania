// Installing Dependencies

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint for the "Persist" object

const persistSchema = mongoose.Schema({
    key: { type: String, required: true }
});

persistSchema.plugin(uniqueValidator);

// Exporting the Persist Blueprint

module.exports = mongoose.model('Persist', persistSchema);