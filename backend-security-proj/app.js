// express app
const express = require('express');
const app = express();

// mysql connection
const { mysql } = require("./db/mysql.js")

// bcrpyt
const bcrypt = require("bcrypt")

// models
const Response = require("./models/Response.js");

const port = process.env.PORT || 3000;

// automatically parse incoming JSON into JS object which you can access on req.body
app.use(express.json());

app.get('/', function (req, res) {
    // return will terminate all the function
    // if only res.send(), you still can execute the lines after it.
    return res.send({
        message: 'Hello World'
    });
});

// testing DB
app.get('/testing/db', async (req, res) => {
    var sql = "SELECT * FROM Role";
    mysql.query(sql, (err, rows) => {
        res.send({
            rows: rows
        });
        mysql.end();
    });
});

app.post('/salting', async (req, res) => {
    try{
        const { password } = req.body; // deconstructing assignment
        const saltRounds = 10; // for slow hashing

        // apply the hash function multiple times(generate a new salt value for each round)
        const salt = await bcrypt.genSalt(saltRounds);
        console.log('Salt: ', salt);
            
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hash: ', hashedPassword);
        // information: [algorithm]$[cost]$[salt][hash]

        const response = new Response(200, true, 'salting password!', {
            salt: salt,
            hash: hashedPassword
        });
        response.send(res);

    }catch(err){
        console.error(err.message);

        const response = new Response(500, false, err.message, null);
        response.send(res);
    }
});

app.post('/signup', async (req, res) => {
    try{
        const { account, password, name, gender, age, role } = req.body;

    }catch(err){
        console.error(err.message);

        const response = new Response(500, false, err.message, null);
        response.send(res);
    }
});

// launch
app.listen(port, () => {
    console.log("Server is up on port " + port);
});

// export this js file to a module 
// so that other files can access using require()
module.exports = app;
