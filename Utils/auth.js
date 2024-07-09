const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(user){
    const expirationTime = 60;  // 60 minute expuration time
    const payload = {
        userId: user._id.toString()
    }
    // create token by taking payload, algorithm and secret and exp time
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: expirationTime * 60
    });
    // return the token
    return token;
}

// Middleware to verify the token
function verifyToken(req, res, next){
    const token = req.headers['authorization'].split(' ')[1];
    // if not token 
    if(!token){
        return res.status(403).send('Token is required, please login');
    }
    // verify the token using jsonwebtoken library
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedUser) => {
        if(err){
            return res.status(401).send('Invalid Token');
        }
        // set req.user = decodeduser
        req.user = decodedUser;
        next();
    });
}

module.exports = {
    generateToken,
    verifyToken
};