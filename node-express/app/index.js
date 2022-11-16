const dbConfig = require("./config/db.config");

/*
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
)
*/



//First, create the mysql server
/*
var server = mysql.createServer((c) => {
    //Connection listener
    console.log('Client Connected');
    c.on('end', () => {
        console.log('Client disconnected');
    });
    c.write('Hello\r\n')
    c.pipe(c);
});

server.on('error', (err) => {
    err.print();
});

server.listen(3306, () => {
    console.log("Server bounded on port 3306")
});
//*/
//*


//connection.end();

module.exports = {
    //Server: server
    //Connection: connection
};