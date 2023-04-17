const mysql = require("mysql2");

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: process.env.DB_Host,
        database: process.env.DB_name,
        user: process.env.DB_User,
        password: process.env.DB_Password,

    }
);

db.connect(function(err) {
    if (err) throw err;
    // console.log("Connection established.");
    
}
);


module.exports = db;
