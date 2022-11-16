const Organisation = require("../models/organisation.model.js");
const Result = require("../models/result.model.js");
const constants = require("../config/constants.config.js");
const Group = require("../models/group.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    const result = new Result({
        id : -1,
        data : req.body.data,
        personId : req.user.personId,
        dummyId : req.body.dummyId,
        version : req.body.version
    });

    Result.create(result, (err, data) => {
        if (err)
            res.status(500).json({
                message:
                err.message || "An error occured while creating a result"
            });
        else res.json(data);
    });
}

exports.findByPerson = (req, res) => {
    //To verify that they can search for this person, they must exist under your current session organisation
    (async () => {
        //Let's query for groups in common
        let groupInCommon = false;
        await new Promise((resolve) => Group.inCommon(req.user.personId, req.params.id, (err, data) => {
            if (err) {
                if (err.kind != "not_found") {
                    console.log("Error with finding groups in common: " + err);
                }
                resolve();
                return;
            }

            groupInCommon = true;
            resolve();
        }));

        if (groupInCommon) {
            Result.findByPerson(req.params.id, (err, data) => {
                if (err) {
                    if (err.kind == "not_found") {
                        res.status(200).json([]);
                    } else {
                        res.status(500).json({
                            message: "Error retrieving Results with person id: " + req.params.id
                        });
                    }
                } else res.json(data);
            });
        } else {
            //Let's verify that they have sufficient privileges
            if ((!req.user.roleId || req.user.roleId > constants.ROLE.administrator) && !groupInCommon) {
                res.status(401).json({message: "Insufficient privileges in your organisation to perform this operation"});
                return;
            }

            Organisation.getAll(req.params.id, (err, organisations) => {
                if (err) {
                    if (err.kind == "not_found") {
                        res.status(200).json([])
                    } else {
                        res.status(500).json({message: "An internal error has occured"});
                    }
                } else {
                    //Check if any of that person's organisations matches your current organisation

                    //Remap to id array
                    organisations = organisations.map((x) => {return x.id});

                    let hasMatch = false;
                    for(var i=0; i<organisations.length; i++) {
                        if (organisations[i] == req.user.organisationId) {
                            hasMatch = true;
                            break;
                        }
                    }
                    if (hasMatch) {
                        Result.findByPerson(req.params.id, (err, data) => {
                            if (err) {
                                if (err.kind == "not_found") {
                                    res.status(200).json([]);
                                } else {
                                    res.status(500).json({
                                        message: "Error retrieving Results with person id: " + req.params.id
                                    });
                                }
                            } else res.json(data);
                        });
                    } else {
                        res.status(200).json([])
                    }
                }
            })
        }
    })();
}

exports.findOwn = (req, res) => {
    const id = req.user.personId;
    Result.findByPerson(id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({
                    message: `Error retrieving Results with person id: ${id}`
                });
            }
        } else res.json(data);
    });
}