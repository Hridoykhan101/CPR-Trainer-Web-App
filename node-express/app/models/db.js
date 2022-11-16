var mysql = require("mysql2");
//const dbConfig = require("../config/db.config");

var connection;
function handleDisconnect() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        pool: process.env.DB_POOL
    });  // Recreate the connection, since the old one cannot be reused.
    connection.connect(err => {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
            return;                                 // to avoid a hot loop, and to allow our node script to
        }                                           
        console.log("Successfully connected to the database");
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
    connection.on('error', err => {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            //throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

/* Misc DB functions here */
function removeToken(token) {
    connection.execute("DELETE FROM Token WHERE token = ?", [token], (err, res) => {
        if (err) {
            console.log("Error deleting token: ", err);
            return;
        }

        /*if (res) {
            console.log("Removed tokens.", res.affectedRows, "row(s) affected");
        }*/
    });
}
function removeTokens(personId, tokenType) {
    connection.execute("DELETE FROM Token WHERE personId = ? AND tokenType = ?", [personId, tokenType], (err, res) => {
        if (err) {
            console.log("Error deleting token: ", err);
            return;
        }
    });
}
function findToken(token, result) {
    connection.execute("SELECT * FROM Token WHERE token = ?", [token], (err, res) => {
        if (err) {
            console.log("error finding token: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found token: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({kind: "not_found"}, null);
    });
}
function addToken(userId, tokenType, token) {
    connection.execute("INSERT INTO Token SET personId = ?, token = ?, tokenType = ?", [userId, token, tokenType]);
}

module.exports = connection;
module.exports.removeToken = removeToken;
module.exports.findToken = findToken;
module.exports.addToken = addToken;
module.exports.removeTokens = removeTokens;