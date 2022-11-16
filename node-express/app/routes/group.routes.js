const auth = require("../config/auth.config");

module.exports = app => {
    const group = require("../controllers/group.controller.js");

    //Create a new Group
    app.post("/group", auth.verify, group.create);

    //Join a group
    app.post("/group/join/:joinCode", auth.verify, group.join);   //Uses group code

    //Leave a group
    app.delete("/group/leave/:joinCode", auth.verify, group.leave);   //Uses group code

    //Get all groups that you've joined
    app.get("/group", auth.verify, group.getGroups);

    //Get all the users in the specified group
    app.get("/group/users/:groupId", auth.verify, group.getPeople);
};