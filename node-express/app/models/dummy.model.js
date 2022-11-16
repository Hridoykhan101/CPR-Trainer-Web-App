const sql = require("./db.js");

var d = new Date();

const Dummy = function(dummy) {
    this.id = dummy.id;
    this.organisationId = dummy.organisationId;
    this.qrCode = dummy.qrCode;
    this.macAddress = dummy.macAddress;
    this.name = dummy.name;
    this.personId = dummy.personId;
}

Dummy.create = (newDummy, result) => {
    sql.execute("INSERT INTO Dummy SET organisationId = ?, qrCode = ?, macAddress = ?, name = ?, personId = ?",
    [newDummy.organisationId || null, newDummy.qrCode, newDummy.macAddress, newDummy.name, newDummy.personId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        console.log("Created dummy: ", {...newDummy, id: res.insertId});
        result(null, {...newDummy, id: res.insertId})
    });
};

Dummy.update = (id, dummy, result) => {
    sql.execute("UPDATE Dummy SET organisationId = ?, qrCode = ?, macAddress = ?, name = ?, personId = ?",
    [newDummy.organisationId, newDummy.qrCode, newDummy.macAddress, newDummy.name, newDummy.personId], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            result({kind: "not_found"}, null);
            return;
        }

        console.log("Updated dummy: ", {...dummy, id: id});
        result(null, {...person, id: id});
    });
}

Dummy.findQr = (qrCode, result) => {
    sql.execute(`SELECT * FROM Dummy WHERE qrCode = ?`, [qrCode], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found Dummy: ", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
};

Dummy.getByPerson = (personId, result) => {
    sql.execute(`SELECT * FROM Dummy WHERE personId = ?`, [personId], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found Dummy: ", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

Dummy.getByOrganisation = (organisationId, result) => {
    sql.execute("SELECT * FROM Dummy WHERE organisationId = ?", [organisationId], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found Dummies: ", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

Dummy.getByMacAddress = (macAddress, result) => {
    sql.execute(`SELECT * FROM Dummy WHERE macAddress = ?`, [macAddress], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found Dummies: ", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

module.exports = Dummy;