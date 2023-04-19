// we will do some authentication in the middleware
const jwt = require("jsonwebtoken");

require('dotenv').config();
const config = process.env;

const Response = require('../models/Response.js');

const verifyToken = (req, res, next) => {
    // get token from header->Authorization->Bearer
    var token = req.headers["authorization"];

    if (!token) {
        const response = new Response(401, false, "A token is required for authentication", null);
        return response.send(res);
    }
    token = token.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userContext = decoded;
    } catch (err) {
        const response = new Response(403, false, "Invalid token", null);
        return response.send(res);
    }

    // go to next middleware
    return next();
};
  
module.exports = {
    verifyToken: verifyToken
};