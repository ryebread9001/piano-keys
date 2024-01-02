var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const jumperController = require('./jumperController');
const path = require('node:path')
// init sqlite connection
let db = new sqlite3.Database("/var/database/messages.db", sqlite3.OPEN_READWRITE);

var app = express();



app.use(express.urlencoded({ extended: true, parameterLimit: 1000000 })) // For Post requests
app.use(bodyParser.json({ limit: '50mb' })) // support json encoded bodies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))
app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/static')))

// view engine setup

app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  res.render('index', {
    title: 'lyssie.org'
  });
})
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
  res.status(200).send("cleared messages");
})

app.get('/breakroom', (req, res) => res.render('jumper'))
app.post('/jumper-score', jumperController.postScore)
app.get('/jumper-score', jumperController.getScore)

app.get('/music', (req, res) => res.render('music'))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render('error');
});

app.listen(3000, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT 3000");
});

module.exports = app;
