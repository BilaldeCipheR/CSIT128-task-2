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
    console.log("Connected to recipeLog!");

var sql_admin = "CREATE TABLE IF NOT EXISTS admin_user (" +
        "username VARCHAR(50) PRIMARY KEY, " +
        "u_password VARCHAR(50), " +
        "u_fname VARCHAR(50), " +
        "u_lname VARCHAR(50), " +
        "u_email VARCHAR(50))";

    con.query(sql_admin, function (err, result) {
        if (err) throw err;
        console.log("Table 'admin_user' created or already exists");


        var sql_recipes = "CREATE TABLE IF NOT EXISTS recipes (" +
            "rcp_id INT AUTO_INCREMENT PRIMARY KEY, " +
            "rcp_title VARCHAR(100), " +
            "rcp_cuisine VARCHAR(50), " +
            "rcp_ingredients TEXT, " +
            "rcp_instructions TEXT, " +
            "rcp_cooktime VARCHAR(20), " + 
            "rcp_servings VARCHAR(20), " +  
            "rcp_author VARCHAR(50), " +
            "FOREIGN KEY (rcp_author) REFERENCES admin_user(username))";

        con.query(sql_recipes, function (err, result) {
            if (err) throw err;
            console.log("Table 'recipes' created or already exists");
process.exit();
        });
    });
});