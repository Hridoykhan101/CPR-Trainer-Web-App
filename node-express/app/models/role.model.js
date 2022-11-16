const sql = require("./db.js");
const constants = require("../config/constants.config.js")

const Role = function(role) {
    this.organisationId = role.organisationId;
    this.name = role.name;
}

Role.create = (newRole, result) => {
    sql.execute("INSERT INTO Role SET organisationId = ?, name = ?",
    [newRole.organisationId, newRole.name], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        console.log("Created Role: ", {...newRole, id: res.insertId});
        result(null, {...newRole, id: res.insertId})
    });
};

Role.assign = (roleId, personId, organisationId, result) => {
    //console.log("Going to assign roleId: " + roleId + " with personId: " + personId);
    sql.execute("INSERT INTO PersonRole SET personId = ?, roleId = ?, organisationId = ?",
    [personId, roleId, organisationId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        
        console.log("Assigned role");
        result(null, {message: `Changed ${res.affectedRows} row(s)`})
    });

    //Invalidate that user's access session
    sql.removeTokens(personId, constants.TOKEN_TYPE.access);
}

Role.unassign = (roleId, personId, organisationId, result) => {
    //console.log("Going to unassign roleId: " + roleId + " with personId: " + personId);
    sql.execute("DELETE FROM PersonRole WHERE personId = ? AND roleId = ? AND organisationId = ?",
    [personId, roleId, organisationId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        
        console.log("Unassigned role");
        result(null, {message: `Changed ${res.affectedRows} row(s)`})
    });

    //Invalidate that user's access session
    sql.removeTokens(personId, constants.TOKEN_TYPE.access);
}

//Only show the relevant roles under the organisations they share
Role.getRoles = (personId, organisationId, result) => {
    //Get the organisations both users are under
    //personOrgs = "SELECT Organisation.id FROM PersonRole, Role, Organisation WHERE Organisation.id = Role.organisationId AND Role.id = PersonRole.roleId AND PersonRole.personId = ?"
    //Organisation Roles
    //orgRoles = "SELECT Role.id AS 'roleId', Role.name AS 'roleName', Organisation.id AS 'organisationId' FROM Role, PersonRole, Organisation WHERE Organisation.id = Role.organisationId AND Role.id = PersonRole.roleId AND Organisation.id IN (?) AND PersonRole.personId = ?"
    //orgRoles = "SELECT Role.id AS 'roleId', Role.name AS 'roleName', Organisation.id AS 'organisationId' FROM Role, PersonRole, Organisation WHERE Organisation.id = Role.organisationId AND Role.id = PersonRole.roleId AND Organisation.id = ? AND PersonRole.personId = ?"
    orgRoles = "SELECT Role.id AS 'id', Role.name AS 'name' FROM Role, PersonRole, Organisation WHERE Organisation.id = ? AND PersonRole.personId = ? AND Role.id = PersonRole.roleId AND PersonRole.organisationId = Organisation.id";

    //Person Roles related to the organisation
    sql.execute(orgRoles, [organisationId, personId], (err, res) => {
        if (err) {
            console.log("Error finding associated organisations for person: ", personId);
            console.log("Error was: ", err)
            result(err, null);
            return;
        }

        console.log("Found roles: ", res);

        result(null, res);
    });
}

Role.getOrganisationRoles = (organisationId, result) => {
    sql.execute("SELECT * FROM PersonRole WHERE organisationId = ?", [organisationId], (err, res) => {
        if (err) {
            console.log(err)
            result(err, null)
            return;
        }

        console.log("Found organisation roles: ", res);
        result(null, res);
    });
}

Role.join = (personId, organisationId, result) => {
    sql.execute("INSERT INTO PersonRole SET personId = ?, roleId = ?, organisationId = ?",
    [personId, constants.ROLE.member, organisationId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        
        result(null, {message: `Changed ${res.affectedRows} row(s)`})
    });

    //Invalidate that user's access session
    sql.removeTokens(personId, constants.TOKEN_TYPE.access);
}

module.exports = Role;