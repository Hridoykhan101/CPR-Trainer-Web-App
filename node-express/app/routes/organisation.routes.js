const auth = require("../config/auth.config");

module.exports = app => {
    const organisation = require("../controllers/organisation.controller.js");

    //Create a new organisation
    app.post("/organisation/create", auth.verify, organisation.create);

    //Get all organisations belonging to the user
    app.get("/organisation", auth.verify, organisation.getAll);

    //Get organisations by name
    app.get("/organisation/name/:name", organisation.getByName);

    //Get everyone under an organisation
    app.get("/organisation/people", auth.verify, organisation.getAllPeople);
};