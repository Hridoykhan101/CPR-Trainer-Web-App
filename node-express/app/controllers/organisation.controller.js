const Organisation = require("../models/organisation.model.js");
const Role = require("../models/role.model.js");
const auth = require("../config/auth.config.js");
const http = require("http");
const constants = require("../config/constants.config");
const Person = require("../models/person.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    const organisation = new Organisation({
        id: -1,
        name: req.body.name,
        addressLine: req.body.addressLine,
        postCode: req.body.postCode,
        suburb: req.body.suburb,
        securityFlags: req.body.securityFlags || 0
    })

    Organisation.create(organisation, (err, data) => {
        if (err)
            res.status(500).json({
                message:
                err.message || "An internal error occured while creating an organisation"
            });
        else {
            const newOrg = data;
            let result_ga;
            let result_a;
            let result_t;
            let result_m;
            let has_err = false;

            /*
            console.log("GA: " + result_ga);
            console.log("newOrg: " + newOrg);
            console.log("Current user: " + req.user.personId)
            */

            const options = {
                hostname: 'localhost',
                port: process.env.PORT,
                path: '/role/create',
                method: 'POST',
                headers: {
                    'authorization' : req.headers.authorization
                }
            };
            //console.log("Options created");

            //Build the roles for the organisation
            //This is a huge task
            
            try {(async () => {
                /*
                await new Promise((resolve, reject) => Role.create({organisationId: newOrg.id, name: "Global Administrator"}, (err, data) => {
                    if (err) {
                        console.log("Error creating role");
                        has_err = true;
                        reject()
                    } else {
                        result_ga = data;
                        //console.log("Assigned ga: " + result_ga + ". Data is: " + data);
                        resolve()
                    }
                    
                }));
                //Now that the global administrator has been created, apply grant permissions
                

                await new Promise((resolve, reject) => Role.create({organisationId: newOrg.id, name: "Administrator"}, (err, data) => {
                    if (err) {
                        console.log("Error creating role");
                        has_err = true;
                        reject()
                    } else {
                        result_a = data;
                        resolve()
                    }
                }));
                await new Promise((resolve, reject) => Role.create({organisationId: newOrg.id, name: "Teacher"}, (err, data) => {
                    if (err) {
                        console.log("Error creating role");
                        has_err = true;
                        reject()
                    } else {
                        result_t = data;
                        resolve()
                    }
                }));
                await new Promise((resolve, reject) => Role.create({organisationId: newOrg.id, name: "Member"}, (err, data) => {
                    if (err) {
                        console.log("Error creating role");
                        has_err = true;
                        reject()
                    } else {
                        result_m = data;
                        resolve()
                    }
                }));
                */

                //console.log(result_ga);
                //result_ga = JSON.parse(result_ga);
                //console.log("result_ga: " + JSON.stringify(result_ga));

                //Then with that, assign the creating user the global admin role
                //console.log("req.user: " + JSON.stringify(req.user));
                if (!has_err) {
                    Role.assign(constants.ROLE.globalAdministrator, req.user.personId, newOrg.id, (err, data) => {
                        if (err) {
                            console.log("Error assigning user role");
                            res.status(500).json({message: "An internal error occured while creating an organisation"})
                        } else {
                            res.status(200).json({message: "Successfully created an organisation", organisation: newOrg});
                        }
                    })
                } else {
                    res.status(500).json({message: "An internal error occured while creating an organisation"})
                }
            })()}
            catch(e) {
                res.status(500).json({message: "An internal error occured while creating an organisation"});
            };

            


            //Now with the newly created Organisation, we generate the org-unique user roles
            /*
            Role.create({organisationId: newOrg.id, name: "Global Administrator"}, (err, data) => {
                if (err) {
                    console.log("Error creating role");
                    has_err = true;
                } else {
                    result_ga = data;
                    console.log("Assigned ga: " + result_ga + ". Data is: " + data);
                }
            });
            Role.create({organisationId: newOrg.id, name: "Administrator"}, (err, data) => {
                if (err) {
                    console.log("Error creating role");
                    has_err = true;
                } else {
                    result_a = data;
                }
            });
            Role.create({organisationId: newOrg.id, name: "Teacher"}, (err, data) => {
                if (err) {
                    console.log("Error creating role");
                    has_err = true;
                } else {
                    result_t = data;
                }
            });
            Role.create({organisationId: newOrg.id, name: "Member"}, (err, data) => {
                if (err) {
                    console.log("Error creating role");
                    has_err = true;
                } else {
                    result_m = data;
                }
            });
            */

            //Get user ID based on access token
            //hAccessToken = auth.getHeaderAccessToken(req);
            //console.log(hAccessToken);
            

            
        }
    });
}

exports.getAll = (req, res) => {
    Organisation.getAll(req.user.personId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({message: "An error occurred retrieving the related organisations"})
            }
        } else res.status(200).json(data);
    })
}

exports.getByName = (req, res) => {
    Organisation.getByName(req.params.name, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({message: "An internal error has occured"})
            }
        } else res.status(200).json(data);
    })
}

exports.getAllPeople = (req, res) => {
    if (!req.user.roleId || req.user.roleId > constants.ROLE.administrator) {
        res.status(403).json({message: "You are not under an organisation / insufficient privileges"});
        return;
    }

    //Now since we've verified that they are allowed to get all people under an organisation, we shall perform that
    Organisation.getPersonIds(req.user.organisationId, (err, personData) => {
        if (err) {
            if (err.kind == "not_found") {
                console.log("Critical error: Your session indicates that you're under an invalid organisation, but there should at least be 1 result. PersonId: " + req.user.personId);
                res.status(200).json([]);
                return;
            } 

            console.log(err);
            res.status(500).json({message: "An internal error has occured while trying to get person ids from an organisation"});
            return;
        }

        //We have successfully obtained person ids, now get their details
        console.log("Person ids: " + JSON.stringify(personData));
        personIds = personData.map(x => {return x.personId});

        Person.getDetails(personIds, (err, personDetails) => {
            if (err) {
                if (err.kind == "not_found") {
                    console.log("No person was found using (" + personIds +"):", err);
                    res.status(200).json([]);
                    return;
                }

                console.log(err);
                res.status(500).json({message: "An internal error occured while getting person details"});
                return;
            }

            //Map those person details with their role id
            personDetails = personDetails.map((person, index) => {return {roleId : personData[index].roleId, ...person}})

            res.status(200).json(personDetails);
        })
    });
}