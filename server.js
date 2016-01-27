var http = require('http'),
    express = require('express'),
    app = express(),
    sqlite3 = require('sqlite3').verbose(),
    bodyParser = require('body-parser'),
    db = new sqlite3.Database('emails-database');

/* We add configure directive to tell express to use Jade to
   render templates */
app.set('views', __dirname + '/public');
app.engine('.html', require('jade').__express);

// Allows express to get data from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='emails'", function(err, row) {
    if(err !== null) {
        console.log(err);
    }
    else if(row == null) {
        db.run('CREATE TABLE "emails" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "email" VARCHAR(255), number VARCHAR(255))', function(err) {
            if(err !== null) {
                console.log(err);
            }
            else {
                console.log("SQL Table 'emails' initialized.");
            }
        });
    }
    else {
        console.log("SQL Table 'emails' already initialized.");
    }
});

// We render the templates with the data
app.get('/', function(req, res) {
  var params = {
    "placeholder": "placeholder"
  };
  res.render('index.jade', params, function(err, html) {
    res.send(html);
  });
});

// We define a new route that will handle bookmark creation
app.post('/add', function(req, res) {
    email = req.body.email;
    number = req.body.number;
    sqlRequest = "INSERT INTO 'emails' (email, number) VALUES('" + email + "', '" + number + "')"
    db.run(sqlRequest, function(err) {
        if(err !== null) {
            res.status(500).send("An error has occurred -- " + err);
        }
        else {
            res.redirect('/?success=true');
        }
    });
});

/* This will allow Cozy to run your app smoothly but
 it won't break other execution environment */
var port = process.env.PORT || 9250;
var host = process.env.HOST || "127.0.0.1";

// Starts the server itself
var server = http.createServer(app).listen(port, host, function() {
    console.log("Server listening to %s:%d within %s environment",
                host, port, app.get('env'));
});
