const auth = require("../config/auth.config");

module.exports = app => {
    const person = require("../controllers/person.controller.js");

    //Create a new person
    app.post("/person/register", person.create);

    //Find a person by id
    //app.get("/person/:id", auth.verify, person.find);

    //Get itself
    app.get("/person", auth.verify, person.findOwn);
    
    //Update a person
    app.put("/person/:id", auth.verify, person.update);

    //Update a person's password
    //app.put("/person/password/:id", auth.verify, person.updatePassword);

    //Update own's password
    app.put("/person/password/", auth.verify, person.updatePasswordOwn);

    //Check if a username already exists
    app.get("/person/username/:username", person.findUsername);

    //Check if an email already exists
    app.get("/person/email/:email", person.findEmail);

    //Person login
    app.post("/person/login", person.login);

    //Person logout
    app.delete("/person/logout", auth.verify, person.logout);
    
    //Refresh token
    app.post("/refresh", person.tokenRefresh);
};