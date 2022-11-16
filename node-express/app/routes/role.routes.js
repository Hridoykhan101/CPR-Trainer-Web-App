const auth = require("../config/auth.config");

module.exports = app => {
    const role = require("../controllers/role.controller.js");

    //Create a new Role
    app.post("/role", auth.verify, role.create);

    //Delete a role
    //app.delete("/role/:roleId", auth.verify, role.delete);

    //Assign a role
    app.post("/role/assign", auth.verify, role.assign);

    //Unassign a role
    app.delete("/role/unassign", auth.verify, role.unassign);

    //Get organisation-related roles from a person
    app.get("/role/:personId", auth.verify, role.getPersonRoles);

    //Get own roles
    app.get("/role", auth.verify, role.getOwnRoles);

    //Join an organisation
    app.put("/role/join/:organisationId", auth.verify, role.join);
};