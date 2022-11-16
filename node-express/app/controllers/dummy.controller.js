const Dummy = require("../models/dummy.model.js");
const Organisation = require("../models/organisation.model.js");
const Role = require("../models/role.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    const dummy = new Dummy({
        id: -1,
        organisationId: req.user.organisationId,
        qrCode: req.body.qrCode,
        macAddress: req.body.macAddress,
        name: req.body.name,
        personId: req.user.personId
    })

    Dummy.create(dummy, (err, data) => {
        if (err)
            res.status(500).json({
                message:
                err.message || "An error occured while creating a dummy"
            });
        else res.json(data);
    });
}

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content cannot be empty"
        });
    }

    Dummy.update(req.params.id,
        new Dummy(req.body),
        (err, data) => {
            if (err) {
                if (err.kind == "not_found") {
                    res.status(200).json([]);
                } else {
                    res.status(500).json({
                        message: `Error updating Dummy with person id ${req.params.personId}`
                    });
                }
            } else res.json(data);
        }
    )
}

exports.findQr = (req, res) => {
    Dummy.findQr(req.params.qrCode, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({
                    message: "Error retrieving Dummy with QR Code: " + req.params.qrCode
                });
            }
        } else res.json(data);
    })
}

exports.getByMacAddress = (req, res) => {
    Dummy.findByMacAddress(req.params.macAddress, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({
                    message: "Error retrieving Dummy with Mac Address: " + req.params.macAddress
                });
            }
        } else res.json(data);
    })
}

exports.getByPerson = (req, res) => {
    Dummy.getByPerson(req.user.personId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({
                    message: "An internal error has occured",
                    error: err.message
                });
            }
        } else res.json(data);
    })
}

exports.getByOrganisation = (req, res) => {
    if (!req.user.organisationId) {
        res.status(405).json({
            message: "You must be under an organisation to perform this action"
        });
        return;
    }

    Dummy.getByOrganisation(req.user.organisationId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).json([]);
            } else {
                res.status(500).json({
                    message: "An internal error has occured",
                    error: err.message
                });
            }
        } else res.json(data);
    })
}