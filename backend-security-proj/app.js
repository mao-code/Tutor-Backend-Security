// express app
const express = require('express');
const app = express();

// mysql connection
const { mysql, mysqlQuery } = require("./db/mysql.js")

// bcrpyt
const bcrypt = require("bcrypt")

// dotenv
require('dotenv').config()

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

    // callback approach
    // mysql.query(sql, (err, rows) => {
    //     res.send({
    //         rows: rows
    //     });
    //     mysql.end();
    // });

    // node native promisify (more readable)
    var data = await mysqlQuery(sql);
    mysql.end(); // will close the whole connection

    res.send({
        data: data
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
        // we skip the data validation here
        const { account, password, name, gender, age, role } = req.body;
        
        // hash salting password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);          
        const hashedPassword = await bcrypt.hash(password, salt);

        // get roleId
        const sqlRole = `
        SELECT id 
        FROM Role
        WHERE name = '${role}';`;
        const roleId = (await mysqlQuery(sqlRole))[0].id;

        // generate refreshToken (later)
        const refreshToken = "test";

        // insert user
        const sqlUser = `
        INSERT INTO User(name, gender, age, roleId)
        VALUES('${name}', '${gender}', ${age}, '${roleId}');`; 
        let userId = (await mysqlQuery(sqlUser)).insertId; // get userid

        // insert user credential
        const sqlUserCredential = `
        INSERT INTO UserCredential(account, password, salt, refreshToken, userId)
        VALUES('${account}', '${hashedPassword}', '${salt}', '${refreshToken}', '${userId}');`; 
        await mysqlQuery(sqlUserCredential);

        const response = new Response(200, true, "Sign up successfully!", null);
        response.send(res);

    }catch(err){
        console.error(err.message);

        const response = new Response(500, false, err.message, null);
        response.send(res);
    }
});

app.post('/signin', async (req, res) => {
    try{
        var key =  process.env.TOKEN_KEY;
      
        const response = new Response(200, true, "Sign in successfully!", {
            
        });
        response.send(res);

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
