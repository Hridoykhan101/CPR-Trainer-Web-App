const Group = require("../models/group.model.js");
const Person = require("../models/person.model.js");
const auth = require("../config/auth.config.js");
const http = require("http");
const constants = require("../config/constants.config");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    const group = new Group({
        id: -1,
        name: req.body.name,
        joinCode: makeCode(8)
    })

    Group.create(group.name, group.joinCode, (err, newGroup) => {
        if (err)
            res.status(500).json({
                message:
                err.message || "An internal error occured while creating a group. Possibly a duplicate joinCode was generated. Please try again"
            });
        else {
            Group.join(req.user.personId, newGroup.id, (err, data) => {
                if (err) {
                    if (err.kind == "not_found") {
                        console.log(`Group ${group.joinCode} doesn't exist`);
                    }
                    console.log("Error joining group");
                    res.status(500).json({message: "An internal error occured while creating a group"})
                } else {
                    res.status(200).json({message: "Successfully created a group", group: newGroup});
                }
            });
        }
    });
}

exports.join = (req, res) => {
    if (req.params.joinCode.length != 8) {
        res.status(300).json({message: "Bad join code"});
    }

    Group.find(req.params.joinCode, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                console.log("Group with join code: " + req.param.joinCode + " doesn't exist");
                res.status(200).json([]);
                return;
            }

            console.log(err);
            res.status(500).json({message: "An internal error occured while searching for a group"});
            return;
        }

        Group.join(req.user.personId, data[0].id, (err, data) => {
            if (err) {
                if (err.kind == "not_found") {
                    console.log("Group doesn't exist");
                }
                if (err.kind == "no_change") {
                    console.log("For some reason, was unable to join the group");
                }
                console.log("Error joining group");
                res.status(500).json({message: "An internal error occured while joining a group"})
            } else {
                res.status(200).json({message: "Successfully joined a group", group: req.param.joinCode});
            }
        });
    });
}

exports.leave = (req, res) => {
    Group.find(req.params.joinCode, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                console.log("Group with join code: " + req.param.joinCode + " doesn't exist");
                res.status(200).json([]);
                return;
            }

            console.log(err);
            res.status(500).json({message: "An internal error occured while searching for a group"});
            return;
        }

        Group.leave(req.user.personId, data[0].id, (err, leaveRes) => {
            if (err) {
                if (err.kind == "not_found") {
                    console.log("Group doesn't exist");
                }
                if (err.kind == "no_change") {
                    console.log("For some reason, was unable to leave the group");
                }
                console.log(`Person with id: ${req.user.personId} couldn't leave group id: ${data[0].id}`);
                res.status(500).json({message: "An internal error occured while leaving a group"});
            } else {
                //Let's check if we're not the last person leaving. If so, delete the group
                Group.getPeopleIds(data[0].id, (err, peopleIds) => {
                    if (err) {
                        if (err.kind == "not_found") {
                            // We were the last person that just left
                            Group.delete(data[0].id, (err, delStatus) => {
                                if (err) {
                                    console.log(err);
                                    if (err.kind == "no_change") {
                                        return;
                                    }
                                    if (err.kind == "not_found") {
                                        return;
                                    }
                                    return;
                                }
                                res.status(200).json({message: "Successfully left the group", group: req.param.joinCode});
                            })
                            return;
                        }
                        console.log(err);
                        res.status(500).json({message: "An internal error occured while getting details about the group you just left"});
                        return;
                    }

                    res.status(200).json({message: "Successfully left the group", group: req.param.joinCode});
                })
            }
        });
    });
}

exports.getGroups = (req, res) => {
    Group.getGroupIds(req.user.personId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                console.log("You don't belong to any groups");
                res.status(200).json([]);
                return;
            }

            console.log(err);
            res.status(500).json({message: "An internal error occured while obtaining group ids"});
            return;
        }
        
        console.log("Groups: " + JSON.stringify(data));
        groupIds = data.map(x => {return x.groupId});
        console.log("Group ids: " + groupIds);

        Group.getGroupsByIds(groupIds, (err, groups) => {
            if (err) {
                if (err.kind == "not_found") {
                    console.log("No groups exist with specified ids: " + groupIds);
                    
                }

                console.log(err)
                res.status(500).json({message: "An internal error occured while obtaining groups by their respective ids"})
                return;
            }

            res.status(200).json(groups);
        })
    })
}

exports.getPeople = (req, res) => {
    //Verify that the user belongs in the supplied group
    Group.inGroup(req.user.personId, req.params.groupId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                console.log(`User (${req.user.personId}) doesn't belong in supplied group (${req.params.groupId})`);
                res.status(403).json({message: "Session user doesn't belong in this group"});
                return;
            }
            console.log(err);
            res.status(500).json({message: "An internal error occured while verifying if the user belongs in the group"});
            return;
        }

        //User does belong in this group, let's retrieve all the people that belong in this group
        Group.getPeopleIds(req.params.groupId, (err, data) => {
            if (err) {
                if (err.kind == "not_found") {
                    //Oddly, you shouldn't get this error if the first one passed
                    console.log(`No users belong in group ${req.params.groupId}`);
                    res.status(200).json([]);
                    return;
                }
                console.log(err);
                res.status(500).json({message: "An internal error occured while geting personIds from a group"});
                return;
            }

            console.log("Found people: " + JSON.stringify(data));
            personIds = data.map(x => {return x.personId});
            console.log("Person ids: " + personIds);

            //Ok, we have all the people that belong in this group. Let's get all their details for displaying
            Person.getDetails(personIds, (err, data) => {
                if (err) {
                    if (err.kind == "not_found") {
                        console.log(`No users exists for ids: ${personIds}`);
                        res.status(200).json([]);
                        return;
                    }

                    console.log(err);
                    res.status(500).json({message: "An internal error has occured while obtaining user details"});
                    return;
                }
                res.status(200).json(data);
            })
        })
    })
}

function makeCode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}