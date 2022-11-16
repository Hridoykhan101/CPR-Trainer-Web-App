const Person = require("../models/person.model.js");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth.config");
const bcrypt = require("bcryptjs");
const db = require("../models/db.js");
const Organisation = require("../models/organisation.model.js");
const Role = require("../models/role.model.js");
constants = require("../config/constants.config");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
        return;
    }

    //Create the person
    const person = new Person({
        id: -1,
        username: req.body.username,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        privilegeFlags: req.body.privilegeFlags || null,
        birthdate: req.body.birthdate || null,
        isGuest: req.body.isGuest || null
    })

    Person.create(person, (err, data) => {
        if (err) {
            if (err.kind == "duplicate") {
                res.status(409).json({message: "One or more key values already exists in the database. The email and/or username already exists"});
            } else {
                res.status(500).json({
                    message:
                    err.message || "An error occured while creating the person"
                });
            }
        } else {
            tokenResponse(res, data.id);
        }
    });
}

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
        return;
    }

    Person.update(req.params.id,
        new Person(req.body),
        (err, data) => {
            if (err) {
                if (err.kind == "not_found") {
                    res.status(200).json([]);
                } else {
                    res.status(500).json({
                        message: `Error updating person with id ${req.params.id}`
                    });
                }
            } else res.json(data);
        }
    )
}

exports.updatePassword = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
        return;
    };

    Person.updatePassword(req.params.id, bcrypt.hashSync(req.body.password, 8),
        (err, data) => {
            if (err) {
                if (err.kind == "not_found") {
                    res.status(200).json([]);
                } else {
                    res.status(500).json({
                        message: `Error updating person with id ${req.params.id}`
                    });
                }
            } else res.json(data);
        }
    )
}

exports.updatePasswordOwn = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
        return;
    };

    Person.updatePassword(req.user.personId, bcrypt.hashSync(req.body.password, 8),
        (err, data) => {
            if (err) {
                if (err.kind == "not_found") {
                    res.status(200).json([]);
                } else {
                    res.status(500).json({
                        message: `Error updating person with id ${req.user.personId}`
                    });
                }
            } else res.json(data);
        }
    )
}

exports.findUsername = (req, res) => {
    Person.findUsername(req.params.username, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json({
                    exists: false
                })
            } else {
                res.status(500).json({
                    message: "An internal error has occured"
                })
            }
        } else {
            res.status(200).json({
                exists: true
            });
        }
    })
}

exports.findEmail = (req, res) => {
    Person.findEmail(req.params.email, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json({
                    exists: false
                })
            } else {
                res.status(500).json({
                    message: "An internal error has occured"
                })
            }
        } else {
            res.status(200).json({
                exists: true
            });
        }
    })
}

exports.find = (req, res) => {
    Person.find(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({
                    message: "Error retrieving Person with id " + req.params.id
                });
            }
        } else res.json(data);
    })
}

exports.findOwn = (req, res) => {
    Person.find(req.user.personId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({
                    message: `Error retrieving Person with id ${req.user.id}`
                });
            }
        } else res.json(data);
    })
}

exports.login = (req, res) => {
    //Technically, the .email can be both the username and password
    if ((!req.body.email) || !req.body.password) {
        res.status(400).json({
            message: "You need to specify an email/username & password"
        });
        return;
    }

    Person.loginEmail(req.body.email, req.body.password,
        (err, login) => {
            if (err) {
                if (err.kind == "not_found") {
                    //Try with username instead
                    Person.loginUsername(req.body.email, req.body.password, (err, login) => {
                        if (err) {
                            if (err.kind == "not_found") {
                                res.status(400).json({
                                    message: `Incorrect email/username or password`
                                });
                                return;
                            }

                            console.log(err);
                            res.status(500).json({
                                message: "Error with handling login"
                            })
                            return;
                        }

                        //We have found a matching username & password
                        handleLogin(login, res, req.body.organisationId);
                    });
                } else {
                    res.status(500).json({
                        message: `Error with handling login`
                    });
                }
            } else {
                handleLogin(login, res, req.body.organisationId);
            }
        }
    )
}

function handleLogin(login, res, organisationId) {
    //Login was successful
    //Use the first organisation available to the user
    if (organisationId) {
        //Verify if the user belongs in the organisation
        Role.getRoles(login.id, organisationId, (err, role) => {
            if (err) {
                res.status(500).json({
                    message: err.message || "An error occured while getting person roles under the selected organisation"
                });
                return;
            }

            console.log("Roles discovered: " + role);

            if (role.length > 0) {
                //A role was found for the particular user in the organisation
                tokenResponse(res, login.id, organisationId, role[0].id);
                return;
            }

            //Was not a valid organisation to select. We will invalidate the token for safety
            res.status(405).json("Not a valid request");
        });
    } else {
        Organisation.getAll(login.id, (err, organisations) => {
            if (err) {
                if (err.kind == "not_found") {
                    //That is fine. We will login without being under an organisation
                    /*
                    res.status(200).json([])*/
                    tokenResponse(res, login.id);
                } else {
                    res.status(500).json(err || {message: "An internal error occured"});
                }
            } else {
                console.log("First oranisation: " + organisations[0].id);
                //Then get the first role
                Role.getRoles(login.id, organisations[0].id, (err, role) => {
                    if (err) {
                        res.status(500).json({
                            message: "An internal error has occured"
                        })
                    } else {
                        tokenResponse(res, login.id, organisations[0].id, role[0].id);
                    }
                });
            }
        });
    }
}

exports.logout = (req, res) => {
    //const refreshToken = req.body.refreshToken;
    const refreshToken = req.headers.authorization;
    /*
    var ind = auth.refreshTokens.indexOf(req.body.refreshToken);
    if (ind >-1) {
        auth.refreshToken.splice(ind, 1);
    }
    /*/
    //auth.refreshTokens = auth.refreshTokens.filter((token) => token !== refreshToken);
    db.removeToken(refreshToken);
    //*/
    //console.log("Attempted to logout refresh token: " + req.body.refreshToken);
    //console.log("Remaining refresh tokens: " + auth.refreshTokens);
    res.status(200).json("You logged out successfully");
}

exports.tokenRefresh = (req,res)=>{
    //Get the refresh token from the user
    const refreshToken = req.body.refreshToken;
    const organisation = req.body.organisationId;

    //json an error if the token is invalid/missing
    if(!refreshToken) {
        return res.status(400).json("Bad token");
    }

    db.findToken(refreshToken, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(400).json("Bad token");
            } else {
                res.status(500).json({
                    message: "Error retrieving token"
                });
            }
        } else {
            //Create new access token
            jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user)=>{
                if (err) {
                    console.log(err);
                    res.status(400).json("Bad token");

                    //Remove this token since it's invalid
                    db.removeToken(refreshToken);
                } else {
                    //Invalidate the supplied refresh token
                    //auth.refreshTokens = auth.refreshTokens.filter((token) => token !== refreshToken);
                    db.removeToken(refreshToken);

                    //Check if the organisations is specified
                    if (organisation) {
                        //Verify if the user is under this organisation
                        Role.getRoles(user.personId, organisation, (err, data) => {
                            if (err) {
                                res.status(500).json({
                                    message: err.message || "An error occured while getting person roles under the selected organisation"
                                });
                                return;
                            }

                            if (data.length > 0) {
                                //A role was found for the particular user in the organisation
                                tokenResponse(res, user.personId, organisation, data[0].id);
                                return;
                            }

                            //Was not a valid organisation to select. We will invalidate the token for safety
                            db.removeToken(refreshToken);
                            res.status(405).json("Not a valid request");
                        });
                    } else {
                        //Perhaps the token contains id? If not, it will be excluded
                        tokenResponse(res, user.personId, user.organisationId, user.roleId);
                    }
                }
            })
        }
    });
}

function tokenResponse(res, personId, organisationId, roleId) {
    const newAccessToken = auth.getAccessToken(personId, organisationId, roleId);
    const newRefreshToken = auth.getRefreshToken(personId, organisationId, roleId); //getRefreshToken automatically inserts it into the database

    res.status(200).json({
        organisationId,
        roleId,
        newAccessToken,
        newRefreshToken
    })
}