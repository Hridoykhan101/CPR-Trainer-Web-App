const sql = require("./db.js");

var d = new Date();

const Result = function(result) {
    this.id = result.id;
    this.createdDatetime = result.createdDatetime;
    this.data = result.data;
    this.personId = result.personId;
    this.dummyId = result.dummyId;
    this.version = result.version;
}

Result.create = (newResult, result) => {
    sql.execute("INSERT INTO Result SET data = ?, personId = ?, dummyId = ?, version = ?",
    [newResult.data, newResult.personId, newResult.dummyId, newResult.version], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        console.log("Created person: ", {...newResult, id: res.insertId});
        result(null, {...newResult, id: res.insertId})
    });
};

Result.findByPerson = (id, result) => {
    sql.execute(`SELECT * FROM Result WHERE personId = ?`, [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found Results: ", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

module.exports = Result;