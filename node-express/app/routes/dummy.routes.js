const auth = require("../config/auth.config");

module.exports = app => {
    const dummy = require("../controllers/dummy.controller.js");

    //Create a new dummy
    app.post("/dummy", auth.verify, dummy.create);

    //Find a dummy by qrCode
    app.get("/dummy/qr/:qrCode", auth.verify, dummy.findQr);
    
    //Update a dummy
    app.put("/dummy/:id", auth.verify, dummy.update);

    //Get dummies that belong to the user
    app.get("/dummy", auth.verify, dummy.getByPerson);

    //Get dummies under the organisation
    app.get("/dummy/byOrganisation", auth.verify, dummy.getByOrganisation);

    //Get dummies belonging by a mac address
    app.get("/dummy/byMacAddress/:macAddress", auth.verify, dummy.getByMacAddress);
};