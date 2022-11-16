const sql = require("./db.js");

const Grant = function(grant) {
    this.id = grant.id;
    this.roleId = grant.roleId;
    this.grantString = grant.grantString;
}

Grant.create = (newGrant, result) => {
    sql.execute("INSERT INTO GRANT SET roleId = ?, grantString = ?",
    [newGrant.roleId, newGrant.grantString], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        console.log("Created Grant: ", {...newGrant, id: res.insertId});
        result(null, {...newGrant, id: res.insertId});
    });
};

module.exports = Grant;