const sql = require("./db.js");

const Group = function(group) {
    this.id = group.id;
    this.name = group.name;
    this.joinCode = group.joinCode;
}

Group.create = (name, joinCode, result) => {
    console.log("Join code: " + joinCode);
    sql.execute("INSERT INTO accounts.Group SET name = ?, joinCode = ?",
    [name, joinCode], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        console.log("Created Group: ", {name, joinCode, id: res.insertId});
        result(null, {name, joinCode, id: res.insertId})
    });
};

Group.join = (personId, joinCode, result) => {
    sql.execute("INSERT INTO PersonGroup SET personId = ?, groupId = ?", [personId, joinCode], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        
        if (res.affectedRows) {
            result(null, res);
            return;
        }

        result({kind: "no_change"}, null)
        return;
    });
}

Group.find = (joinCode, result) => {
    sql.execute("SELECT * FROM accounts.Group WHERE joinCode = ?", [joinCode], (err, groups) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }

        if (groups.length) {
            result(null, groups);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

Group.leave = (personId, groupId, result) => {
    sql.execute("DELETE FROM PersonGroup WHERE personId = ? AND groupId = ?", [personId, groupId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        
        if (res.affectedRows) {
            result(null, res);
            return;
        }

        result({kind: "no_change"}, null)
        return;
    })
}

Group.delete = (groupId, result) => {
    sql.execute("DELETE FROM accounts.Group WHERE id = ?", [groupId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        
        if (res.affectedRows) {
            result(null, res);
            return;
        }

        result({kind: "no_change"}, null)
        return;
    })
}

Group.getGroupIds = (personId, result) => {
    //First, get the group ids the user is associated with
    sql.execute("SELECT * FROM PersonGroup WHERE personId = ?", [personId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

//This should be an internal function only - shouldn't be exposed to an endpoint
Group.getGroupsByIds = (groupIds, result) => {
    query = `SELECT * FROM accounts.Group WHERE id IN (${groupIds.join(",")})`;
    console.log("Query for Group.getGroupByIds: " + query);
    sql.execute(query, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    })
}

Group.inGroup = (personId, groupId, result) => {
    //Verify that the user belongs to this group
    sql.execute("SELECT * FROM PersonGroup WHERE personId = ? AND groupId = ?", [personId, groupId], (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }

        if (res.length) {
            //There's a match. We belong to this group
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

Group.getPeopleIds = (groupId, result) => {
    sql.execute("SELECT * FROM PersonGroup WHERE groupId = ?", [groupId], (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

Group.inCommon = (person1Id, person2Id, result) => {
    sql.execute("SELECT * FROM PersonGroup WHERE personId = ? AND groupId IN (SELECT groupId FROM PersonGroup WHERE personId = ?)", [person1Id, person2Id], (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    })
}

module.exports = Group;