require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
//const auth = require("./app/config/auth.config");
const jwt = require("jsonwebtoken");
const db = require("./app/models/db");
const ms = require("ms");
const constants = require("./app/config/constants.config");
var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// Setup database
//db.sequelize.sync();

//Don't forget to disconnect from the db
//db.connection.end();

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests
app.use(express.urlencoded({extended: true}));

// Simple route
app.get("/", (req, res) => {
    res.json({ message: "Node.js Express Backend. TakeHeartAustralia"})
})

//Apply routes
require("./app/routes/person.routes.js")(app);
require("./app/routes/dummy.routes.js")(app);
require("./app/routes/result.routes.js")(app);
require("./app/routes/organisation.routes.js")(app);
require("./app/routes/role.routes.js")(app);
require("./app/routes/group.routes.js")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

//Every x days we clean up the database of unused refresh tokens.
//We may get redundant tokens from multiple sign ins
//And some users may no longer use the system
//Also from a security standpoint, it's good that these tokens are actively removed from using the system since a hacker may be able to access an inactive user
//However, if a refresh token is invalid in the database, the user will be required to sign in again
async function cleanupRefreshTokens() {
    while(true) {
        console.log("Cleaning up refresh tokens");
        db.execute("SELECT * FROM Token WHERE tokenType = ?", [constants.TOKEN_TYPE.refresh], (err, res) => {
            if (err) {
                console.log("Error performing query. Are you connected?");
                console.log(err);
            } else {
                for(var i=0; i<res.length; i++) {
                    jwt.verify(res[i].token, process.env.REFRESH_SECRET, (err, result) => {
                        if (err) {
                            db.removeToken(res[i].token);
                        }
                    })
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, ms("21d"))); //32-bit signed integer. Max 24 days
    }
}

//These are invalid access tokens.
async function cleanupAccessTokens() {
    while(true) {
        console.log("Cleaning up access tokens");
        db.execute("SELECT * FROM Token WHERE tokenType = ?", [constants.TOKEN_TYPE.access], (err, res) => {
            if (err) {
                console.log("Error performing query. Are you connected?");
                console.log(err);
            } else {
                for(var i=0; i<res.length; i++) {
                    jwt.verify(res[i].token, process.env.ACCESS_SECRET, (err, result) => {
                        if (err) {
                            db.removeToken(res[i].token);
                        }
                    })
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, ms("30m"))); //32-bit signed integer. Max 24 days
    }
}

cleanupRefreshTokens();
cleanupAccessTokens();