var express = require('express');
var storage = require('node-persist');
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

const port = 3000
const app = express(); 

mongoose.connect('mongodb+srv://regina:lJh3MVjYfGtkzJRn@cluster1.utlod.gcp.mongodb.net/UserAuthDB?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'this is secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`)
}) 