// express app
const express = require('express');
const app = express();

// mysql connection
const { mysql } = require("./db/mysql.js")

// bcrpyt
const bcrypt = require("bcrypt")

// jwt
const jwt = require("jsonwebtoken");
// auth middleware
const { verifyToken } = require("./middlewares/auth.js");

// dotenv
require('dotenv').config()

// CORS
var cors = require('cors')

// models
const Response = require("./models/Response.js");

const port = process.env.PORT || 3000;

// automatically parse incoming JSON into JS object which you can access on req.body
app.use(express.json());
app.use(cors());

// Note: We skip the data validation here.

// HTTP Method: GET, POST, PUT/PATCH, DELETE
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

    // node native promisify (more readable)
    var [rows] = await mysql.query(sql);
    mysql.end(); // will close the whole connection

    res.send({
        data: rows
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
        // information: [algorithm]$[cost]$[salt]/[hash]

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
        
        // hash salting password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);          
        const hashedPassword = await bcrypt.hash(password, salt);

        // get roleId
        const sqlRole = `
        SELECT ID 
        FROM Role
        WHERE name = '${role}';`;
        var [rows] = await mysql.query(sqlRole);
        const roleId = rows[0].ID;

        // generate refreshToken (later)
        const refreshToken = "test";

        // insert user
        const sqlUser = `
        INSERT INTO User(name, gender, age, roleId)
        VALUES('${name}', '${gender}', ${age}, '${roleId}');`; 
        let userId = (await mysql.query(sqlUser))[0].insertId; // get userid

        // insert user credential
        const sqlUserCredential = `
        INSERT INTO UserCredential(account, password, salt, refreshToken, userId)
        VALUES('${account}', '${hashedPassword}', '${salt}', '${refreshToken}', '${userId}');`; 
        await mysql.query(sqlUserCredential);

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
        const { account, password } = req.body;

        // find user
        var sql = `SELECT * FROM UserCredential WHERE account='${account}'`;
        var [rows, fields] = await mysql.query(sql);

        // check user 
        if(rows.length == 0)
        {
            const response = new Response(404, false, "Cannot find user!", null);
            return response.send(res); // return to terminate the request
        }
        userCredential = rows[0];

        //compare hashed password
        if(!(await bcrypt.compare(password, userCredential.password)))
        {
            const response = new Response(403, false, "Invalid password!", null);
            return response.send(res);
        }

        // get jwt secret for signature
        var secret =  process.env.JWT_SECRET;

        // generate accessToken (temporarily)
        const accessToken = jwt.sign(
            {
                userId: userCredential.userId,
                account: userCredential.account,
                issuat: Date.now()
            },
            secret,
            {
                expiresIn: "5m"
            }
        );

        // generate refreshToken
        const refreshToken = jwt.sign(
            {
                userId: userCredential.userId,
                account: userCredential.account,
                issuat: Date.now()
            },
            secret,
            {
                expiresIn: "30d" 
            }
        );

        // add new refreshToken to DB
        sql = `
        UPDATE UserCredential
        SET refreshToken = '${refreshToken}'
        WHERE ID = ${userCredential.ID}
        `;
        await mysql.query(sql);
        
        const response = new Response(200, true, "Sign in successfully!", {
            accessToken: accessToken,
            refreshToken: refreshToken
        });
        return response.send(res);

    }catch(err){
        console.error(err.message);

        const response = new Response(500, false, err.message, null);
        return response.send(res);
    }
});

app.get('/protected', verifyToken, async (req, res) => {
    try{
        const response = new Response(200, true, "Your are successfully authenticated!", null);
        response.send(res);
    }catch(err){
        console.log(err);
        const response = new Response(500, false, err.message, null);
        response.send(res);
    }
});

app.post('/refresh', async (req, res) => {
    try{
        // get refreshtoken
        const { refreshToken } = req.body; 

        const secret = process.env.JWT_SECRET

        // verify refreshtoken (OK and not expired)
        const decoded = jwt.verify(refreshToken, secret);
        
        // compare db refresh token (second protection)
        // if resignin, hacker cannot use
        var sql = `
        SELECT refreshToken
        FROM UserCredential
        WHERE account = '${decoded.account}'
        `;
        [rows] = await mysql.query(sql);
        if(!(rows[0].refreshToken == refreshToken))
        {
            const response = new Response(403, false, "Invalid refresh token!", null);
            return response.send(res);
        }
        
        // sign a new accesstoken
        const newAccessToken = jwt.sign(
            {
                userId: decoded.userId,
                account: decoded.account
            },
            secret,
            {
                expiresIn: "5m" 
            }
        );

        const response = new Response(200, true, "Your are successfully refresh your token!", {
            newAccessToken: newAccessToken
        });
        return response.send(res);
    }catch(err){
        console.log(err);
        const response = new Response(500, false, err.message, null);
        return response.send(res);
    }
});

// launch
app.listen(port, () => {
    console.log("Server is up on port " + port);
});

// export this js file to a module 
// so that other files can access using require()
module.exports = app;
