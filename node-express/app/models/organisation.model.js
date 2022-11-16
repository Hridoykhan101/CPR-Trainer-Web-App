const sql = require("./db.js");

const Organisation = function(organisation) {
    this.id = organisation.id;
    this.name = organisation.name;
    this.addressLine = organisation.addressLine;
    this.postCode = organisation.postCode;
    this.suburb = organisation.suburb;
    this.securityFlags = organisation.securityFlags || 0;
}

Organisation.create = (newOrganisation, result) => {
    sql.execute("INSERT INTO Organisation SET name = ?, addressLine = ?, postCode = ?, suburb = ?, securityFlags = ?",
    [newOrganisation.name, newOrganisation.addressLine, newOrganisation.postCode, newOrganisation.suburb, newOrganisation.securityFlags], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        console.log("Created Organisation: ", {...newOrganisation, id: res.insertId});
        result(null, {...newOrganisation, id: res.insertId})
    });
};

Organisation.getByName = (orgName, result) => {
    console.log("orgName:",orgName);
    // For some reason, it wouldn't let me just do '?%'
    sql.execute("SELECT * FROM Organisation WHERE name LIKE CONCAT(?, '%')", [orgName], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        console.log(res);

        if (res.length) {
            console.log("Organisations found:", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    })
}

Organisation.getAll = (userId, result) => {
    sql.execute("SELECT Organisation.id, Organisation.name, Organisation.addressLine, Organisation.postcode, Organisation.suburb, Organisation.securityFlags, PersonRole.roleId FROM PersonRole, Organisation WHERE PersonRole.organisationId = Organisation.id AND PersonRole.personId = ?", [userId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Obtained organiations from userId: " + userId, ", organisations are: " + JSON.stringify(res));
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    })
}

//Make sure that the user has sufficient priviliges prior to performing this query
//And certainly don't expose this to an endpoint
Organisation.getPersonIds = (organisationId, result) => {
    sql.execute("SELECT personId, roleId FROM Organisation, PersonRole WHERE Organisation.id = ? AND PersonRole.organisationId = Organisation.id", [organisationId], (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found user ids: " + res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

module.exports = Organisation;