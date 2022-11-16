const jwt = require("jsonwebtoken");
const db = require("../models/db.js");
const constants = require("./constants.config");

function getAccessToken(personId, organisationId, roleId) {
    const newAccessToken = jwt.sign({personId: personId, organisationId: organisationId, roleId: roleId}, process.env.ACCESS_SECRET, {expiresIn: "15m"});
    db.addToken(personId, constants.TOKEN_TYPE.access, newAccessToken);
    
    return jwt.sign({personId: personId, organisationId: organisationId, roleId: roleId}, process.env.ACCESS_SECRET, {expiresIn: "15m"});
}

function getRefreshToken(personId, organisationId, roleId) {
    const newRefreshToken = jwt.sign({personId: personId, organisationId: organisationId, roleId: roleId}, process.env.REFRESH_SECRET, {expiresIn: "30d"});
    db.addToken(personId, constants.TOKEN_TYPE.refresh, newRefreshToken);
    //module.exports.refreshTokens.push(newRefreshToken)
    return newRefreshToken;
}

function getHeaderAccessToken(req) {
    try {
        const authHeader = req.headers.authorization;
        return jwt.decode(authHeader.split(" ")[1])
    } catch (e) {
        return null;
    }
}

function verify(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const accessToken = authHeader.split(" ")[1];
        
        jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, user)=> {
            if (err) {
                return res.status(401).json("Access token is not valid!");
            }
            db.findToken(accessToken, (err, dbres) => {
                if (err) {
                    return res.status(401).json("Access token is not valid!");
                }
                console.log("User verified: " + JSON.stringify(user));
                req.user = user;
                next();
            })
            
        });
    } else {
        res.status(401).json("You are not authenticated");
    }
}

module.exports = {
    verify,
    getAccessToken,
    getRefreshToken,
    getHeaderAccessToken
}

/*
module.exports.refreshTokens.push = function(item) {
    console.log("Inserting item: " + item + " into the array from:");
    console.trace();
    return Array.prototype.push.apply(this, arguments);
}
*/