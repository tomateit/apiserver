// Framework imports
require('./config/config');
const createError = require('http-errors');
const express = require('express');

// Utilites imports
const { authenticate } = require('./middleware/authenticate');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Routes import 
const publicRoutes = require('./routes/publicRoutes');
const itemManagement = require('./routes/itemManagement');
const translationManagement = require('./routes/translationManagement');
const userManagement = require('./routes/userManagement')

//--Configuration and consts
const app = express();
app.disable('x-powered-by');
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
//     res.header("Allow", "*");
//     next();
//   });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const cookieSecret = process.env.COOKIE_SECRET;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(cookieSecret));

app.use(express.static(path.join(__dirname, 'public')));



//----Customer service pages

app.get('/', function (req, res) {
  console.log("API root invoked");
  res.render("index",{title: "This is API SERVER", text: "You've just invoked root, good boy :)"});
});

//Public routes
app.use(publicRoutes);
//Everything after authenticate middleware can be accessed only by authenticated users
app.use(authenticate);
app.use(itemManagement);
app.use(translationManagement);
app.use(userManagement);

//If no page found
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// app.listen(PORT, ()=> {
//     console.log(`API Server is up and running on port ${PORT}`);
// });// Framework imports
require('./config/config');
const createError = require('http-errors');
const express = require('express');
// Utilites imports
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const { authenticate } = require('./middleware/authenticate');


// Routes import
const publicRoutes = require('./routes/publicRoutes');
const itemManagement = require('./routes/itemManagement');
const translationManagement = require('./routes/translationManagement');
const userManagement = require('./routes/userManagement')

// --Configuration and consts
const app = express();
app.disable('x-powered-by');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const cookieSecret = process.env.COOKIE_SECRET;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(cookieSecret));

app.use(express.static(path.join(__dirname, 'public')));

// ----Customer service pages

app.get('/', (req, res) => {
    console.log('API root invoked');
    res.render('index', { title: 'This is API SERVER', text: 'You\'ve just invoked root, good boy :)' });
});

// Public routes
app.use(publicRoutes);
// Everything after authenticate middleware can be accessed only by authenticated users
app.use(authenticate);
app.use(itemManagement);
app.use(translationManagement);
app.use(userManagement);

// If no page found
app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
// app.listen(PORT, ()=> {
//     console.log(`API Server is up and running on port ${PORT}`);
// });
