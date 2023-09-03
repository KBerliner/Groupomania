const Client = require('pg').Pool;

const client = new Client({
    host: '192.168.1.21',
    port: '5263',
    user: 'kyleberliner',
    database: 'groupomania'
})

module.exports = client;