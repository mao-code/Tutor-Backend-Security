var mysql = require('mysql');

const host = "localhost";
const user = "root";
const password = "";
const db = "trivagogoro_db";

var conn = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db
});
  
conn.connect(function(err) {
    if (err) throw err;
    console.log(`MySQL Connected! DB: ${db}`);
});

// export objects
module.exports = {
    mysql: conn
};