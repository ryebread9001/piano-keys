var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const sqlite3 = require('sqlite3').verbose();


// init sqlite connection
let db = new sqlite3.Database("/var/database/messages.db", sqlite3.OPEN_READWRITE);

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// lyssie.com/test/15 param
// lyssie.com/test?myqparam=5&othervar=here&yada=hey%20%20nice
app.get("/send/", (req, res) => {
  let msg = req.query.msg;
  let username = req.query.username;
  let id = req.query.id;
  const onlyLettersPattern = /^[A-Za-z0-9 _/.!]+$/;

  if(!msg.match(onlyLettersPattern) || !username.match(onlyLettersPattern)){
    return res.status(400).json({ err: "No special characters and no numbers, please!"})
  }
  if (msg.length < 100) db.run("INSERT INTO chats (username, msg, id) VALUES ( ?1, ?2, ?3 )", {1: username, 2: msg, 3: id});
  res.send("sent message");
})

app.get("/chat", (req, res) => {
  db.all("SELECT * FROM chats", (err, rows) => {
    res.json(rows);
  });
})

app.get("/clear", (req, res) => {
  db.run("DELETE FROM chats");
  res.send("cleared messages");
})

// app.get("/submit/", (req, res) => {
//   let data = req.query.score;
//   let username = req.query.username;
//   db.run("INSERT INTO scores (username, score) VALUES ( ?1, ?2)", {1: username, 2: data});
  
//   res.send("HELLO TEST" + data);
// });

// app.get("/scores", (req, res) => {
//   db.all("SELECT * FROM scores ORDER BY score DESC LIMIT 10", (err, rows) => {
//     res.json(rows);
//   });
// })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
 // render the error page
  const status = err.status || 500;
  res.status(status).send("error:", err);
  
});

app.listen(3000, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT 3000");
});

module.exports = app;
