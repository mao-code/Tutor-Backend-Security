const mysql = require('mysql');
const util = require('util'); // use promisify for mysql

const host = "localhost";
const user = "root";
const password = "";
const db = "BackendSecurity";

var conn = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db
});
  
conn.connect(function(err) {
    if (err) {
        throw err;
    }else{
        console.log(`MySQL Connected! DB: ${db}`);
    }
});

// export objects
module.exports = {
    mysql: conn,
    mysqlQuery: util.promisify(conn.query).bind(conn) // node native promisify (more readable)
};