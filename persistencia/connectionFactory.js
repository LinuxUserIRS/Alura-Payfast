var mysql  = require('mysql');

function createDBConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'italo',
        password: 'maxami',
        database: 'payfast'
    });
}

module.exports = function() {
    return createDBConnection;
}
