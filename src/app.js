// MondoDB User Password: A5JepmLyGaXNyX9i
// MongoDB Connection: mongodb+srv://kberlinco:<password>@cluster0.9hq0f78.mongodb.net/

// Installing Dependencies

const express = require('express');

const app = express();

const { Client } = require('pg');

const mongoose = require('mongoose');

const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const persistRoutes = require('./routes/persist');

app.use(express.json());

// Connecting to PostgreSQL

const client = new Client({
    host: '192.168.1.21',
    port: '5263',
    user: 'kyleberliner',
    database: 'groupomania'
})

client.connect().then(
    () => {
        console.log('Successfully connected to PostgreSQL!');
    }
).catch((error) => {
    console.log('unable to connect to PostgreSQL!');
    console.log(error);
})
;


// Header Middleware

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// API Request Routing

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/', postRoutes);
app.use('/api/', userRoutes);
app.use('/api/', persistRoutes);

// Export

module.exports = app;