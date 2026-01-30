require('dotenv').config();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD, 
    database: "recipeLog"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    var sql = "INSERT INTO admin_user (username, u_password, u_fname, u_lname, u_email) VALUES " +
              "('bin', 'bin123', 'Bin', 'Member', 'bin@demo.com'), " +
              "('reona', 'reona123', 'Reona', 'Member', 'reona@demo.com'), " +
              "('bilal', 'bilal123', 'Bilal', 'Member', 'bilal@demo.com'), " +
              "('masleen', 'masleen123', 'Masleen', 'Member', 'masleen@demo.com')";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Records inserted: " + result.affectedRows);
    });
});