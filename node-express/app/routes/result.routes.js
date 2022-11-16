const auth = require("../config/auth.config");

module.exports = app => {
    const result = require("../controllers/result.controller.js");

    //Upload a result
    app.post("/result/", auth.verify, result.create);
    
    //Find result by person
    app.get("/result/person/:id", auth.verify, result.findByPerson);

    //Find own results
    app.get("/result/person/", auth.verify, result.findOwn);
};