const mysql = require("mysql2");

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: process.env.DB_Host,
        database: process.env.DB_Name,
        user: process.env.DB_User,
        password: process.env.DB_Password,

    }
);





module.exports = db;



