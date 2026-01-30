require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "recipeLog"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        con.query('SELECT * FROM admin_user WHERE username = ? AND u_password = ?', [username, password], (err, results) => {
            if (err) throw err;
            
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/admin.html');
            } else {
                res.send('<script>alert("Incorrect Username and/or Password!"); window.location.href="/";</script>');
            }
        });
    } else {
        res.send('Please enter Username and Password!');
    }
});

app.post('/add-recipe', (req, res) => {
    const { recipeName, recipeIngredients, recipeInstructions, recipeCookTime, recipeServings } = req.body;
    
    if (!req.session.loggedin) {
        return res.send('Please login to perform this action.');
    }
    const author = req.session.username;

    const sql = "INSERT INTO recipes (rcp_title, rcp_ingredients, rcp_instructions, rcp_cooktime, rcp_servings, rcp_author) VALUES (?, ?, ?, ?, ?, ?)";
    
    con.query(sql, [recipeName, recipeIngredients, recipeInstructions, recipeCookTime, recipeServings, author], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        res.send('<script>alert("Recipe added successfully!"); window.location.href="/admin.html";</script>');
    });
});

app.get('/recipes', (req, res) => {
    con.query('SELECT * FROM recipes', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});