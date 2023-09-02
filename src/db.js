const Client = require('pg').Pool;

const client = new Client({
    host: 'localhost',
    port: '5432',
    user: 'kyleberliner',
    database: 'groupomania'
})

module.exports = client;