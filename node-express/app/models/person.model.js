const sql = require("./db.js");
const bcrypt = require("bcryptjs");
const { query } = require("express");

var d = new Date();

const Person = function(person) {
    this.id = person.id;
    this.username = person.username;
    this.fName = person.fName;
    this.lName = person.lName;
    this.email = person.email;
    this.password = person.password;
    this.privilegeFlags = person.privilegeFlags;
    this.birthdate = person.birthdate;
    this.isGuest = person.isGuest;
    this.createdDatetime = 0;
}

Person.create = (newPerson, result) => {
    sql.execute("INSERT INTO Person SET username = ?, fName = ?, lName = ?, email = ?, password = ?, privilegeFlags = ?, birthdate = ?, isGuest = ?", 
    [newPerson.username, newPerson.fName, newPerson.lName, newPerson.email, newPerson.password, newPerson.privilegeFlags, newPerson.birthdate, newPerson.isGuest], (err, res) => {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                //Duplicate entry
                console.log("Error: Duplicate entry");
                result({kind: "duplicate"}, null);
                return;
            } else {
                console.log("Error: ", err);
                result(err, null);
                return;
            }
        }
        //These should have the new id that was returned by the query
        console.log("Created user: ", {...newPerson, id: res.insertId});
        result(null, {...newPerson, id: res.insertId});
    });
};

Person.update = (id, person, result) => {
    sql.execute("UPDATE Person SET fName = ?, lName = ?, privilegeFlags = ?, birthdate = ?, isGuest = ? WHERE id = ?",
    [person.fName, person.lName, person.privilegeFlags, person.birthdate, person.isGuest, id],
    (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({kind: "not_found"}, null);
            return;
        }

        console.log("Updated person: ", {id: id, ...person})
        result(null, {id: id, ...person});
    });
};

Person.updatePassword = (id, password, result) => {
    sql.execute("UPDATE Person SET password = ? WHERE id = ?",
    [password, id],
    (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found"}, null);
            return;
        }

        console.log("Updated person: ", {id: id, ...person});
        result(null, {id: id, ...person});
    });
};

Person.findUsername = (username, result) => {
    sql.execute(`SELECT username FROM Person WHERE username = ?`, [username], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found person: ", [0]);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

Person.findEmail = (email, result) => {
    sql.execute(`SELECT email FROM Person WHERE email = ?`, [email], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found person: ", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

//*
//This should only be called from the user's session. This brings up all of their details
Person.find = (id, result) => {
    sql.execute(`SELECT * FROM Person WHERE id = ?`, [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found person: ", res);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
};
//*/

Person.loginEmail = (email, password, result) => {
    sql.execute(`SELECT * FROM Person WHERE email = ?`, [email], (err, res) => {
        (async () => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            //Should only ever be 1 email. This loop is just for safety
            for(var i=0; i<res.length; i++){
                if (await bcrypt.compare(password, res[i].password)) {
                    console.log("found person: ", res[i]);
                    result(null, res[i]);
                    return;
                }
            }

            result({kind: "not_found"}, null);
        })();
    });
};

Person.loginUsername = (username, password, result) => {
    sql.execute(`SELECT * FROM Person WHERE username = ?`, [username], (err, res) => {
        (async () => {
            if (err) {
                console.log("error: ", str(err));
                result(err, null);
                return;
            }
            
            //Should only ever be 1 username. This loop is just for safety
            for(var i=0; i<res.length; i++){
                if (await bcrypt.compare(password, res[i].password)) {
                    console.log("found person: ", res[i]);
                    result(null, res[i]);
                    return;
                }
            }

            result({kind: "not_found"}, null);
        })();
    });
};

//Be very careful with this one. User access should already be verified prior to performing this query
//This should not be exposed to an endpoint
//Should only be internal
Person.getDetails = (personIds, result) => {
    myQuery = `SELECT id, username, fName, lName FROM Person WHERE id IN (${personIds.join(",")})`; //personIds are not validated. Easy SQL injection
    console.log("Query for Person.getDetails: " + myQuery);
    sql.execute(myQuery, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log(`Found people: ${res}`);
            result(null, res);
            return;
        }

        result({kind: "not_found"}, null);
    });
}

module.exports = Person;