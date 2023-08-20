// Installing Dependencies

const express = require('express');
const router = express.Router();

const persistCtrl = require('../controllers/persist');

// Routing endpoints

router.post('/persist', persistCtrl.persist);

// Exporting routes

module.exports = router;