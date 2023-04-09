// mysql connection
var { mysql } = require("./db/mysql.js")

// express app
var express = require('express');
var app = express();

const port = process.env.PORT || 3000;

// automatically parse incoming JSON into JS object which you can access on req.body
app.use(express.json());

app.get('/', function (req, res) {
    // return will terminate all the function
    // if only res.send(), you still can execute the lines after it.
    return res.send({
        message: 'Hello World'
    });
})

app.get('/db', async (req, res) => {
    var sql = "SELECT * FROM Restaurant";
    mysql.query(sql, (err, rows) => {
        res.send({
            rows: rows
        });
        mysql.end();
    });
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
});

// export this js file to a module 
// so that other files can access using require()
module.exports = app;
