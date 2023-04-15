// const mysql = require('mysql');
// const util = require('util'); // use promisify for mysql

const mysql = require('mysql2');

const host = "localhost";
const user = "root";
const password = "";
const db = "BackendSecurity";

// connection pool
const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: db,
    waitForConnections: true,
    connectionLimit: 10
});

// get a Promise wrapped instance of that pool
const promisePool = pool.promise();
  
pool.getConnection(function(err, connection) {
    if (err) {
        throw err;
    }else{
        console.log(`MySQL Connected! DB: ${db}`);
    }
});

// export objects
module.exports = {
    mysql: promisePool,
    // mysqlQuery: util.promisify(conn.query).bind(conn) // node native promisify (more readable)
};