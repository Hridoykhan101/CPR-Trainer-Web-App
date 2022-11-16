const { decodeBase64 } = require("bcryptjs");
const { ROLE } = require("../config/constants.config.js");
const Organisation = require("../models/organisation.model.js");
const Role = require("../models/role.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    const role = new Role({
        id: -1,
        organisationId: req.body.organisationId,
        name: req.body.name
    })

    Role.create(role, (err, data) => {
        if (err)
            res.status(500).json({
                message:
                err.message || "An error occured while creating an Role"
            });
        else res.json(data);
    });
}

exports.assign = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    //Check if the session user is currently in the organisation
    if (!req.user.organisationId) {
        res.status(400).json({
            message: "You must be under an organisation to perform this operation"
        })
    } else {
        //The user has been assigned to an organisation, according to their session
        if ((req.user.roleId != constants.ROLE.administrator && req.user.roleId != constants.ROLE.globalAdministrator) && (req.user.personId != req.body.personId)) {
            res.status(403).json({message: "Insufficient privileges to perform this operation"})
            return;
        }

        Role.assign(req.body.roleId, req.body.personId, req.user.organisationId, (err, data) => {
            if (err) {
                res.status(500).json({
                    message: "An error occured while assigning an Role"
                });
            } else res.json(data);
        })
    }
}


exports.unassign = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    //Check if the session user is currently in the organisation
    if (!req.user.organisationId) {
        res.status(405).json({
            message: "You must be under an organisation to perform this operation"
        })
    } else {
        //The user has been assigned to an organisation, according to their session
        if ((req.user.roleId != constants.ROLE.administrator && req.user.roleId != constants.ROLE.globalAdministrator) && (req.user.personId != req.body.personId)) {
            res.status(403).json({message: "Insufficient privileges to perform this operation"})
            return;
        }

        Role.unassign(req.body.roleId, req.body.personId, req.user.organisationId, (err, data) => {
            if (err)
                res.status(500).json({
                    message: "An error occured while assigning an Role"
                });
            else res.json(data);
        });
    }
}

exports.getOwnRoles = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
        return;
    }

    if (!req.user.organisationId) {
        res.status(405).json({
            message: "You must be under an organisation to do this. Try refreshing your tokens after applying an organisation"
        })
        return;
    }

    //Get roles based on own id and organisation
    Role.getRoles(req.user.personId, req.user.organisationId, (err, data) => {
        if (err) {
            res.status(500).json({
                message: err.message || "An error occured while getting person roles"
            });
            
        } else res.json(data);
    });
}

exports.getPersonRoles = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    //We now instead, get the target roles based on the session's organisation
    if (!req.user.organisationId) {
        res.status(405).json({
            message: "You must be under an organisation to do this. Try refreshing your tokens after applying an organisation"
        })
    }

    //Get roles based on the supplied user and own's organisations
    Role.getRoles(req.params.personId, req.user.organisationId, (err, data) => {
        if (err) {
            res.status(500).json({
                message: err.message || "An error occured while getting person roles"
            });
            
        } else res.json(data);
    });
}

exports.join = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    //Join an organisation using their current session
    Role.join(req.user.personId, req.params.organisationId, (err, data) => {
        if (err) {
            res.status(500).json({
                message: err.message || "An error occured while getting person roles"
            });
            
        } else res.json(data);
    });
}