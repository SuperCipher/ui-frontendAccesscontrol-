/* @flow */
/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const fs = require('fs');
const https = require('https');
const User = require('./models/User');
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  requestCert: false,
  rejectUnauthorized: false
};

/**
 * Create Express server.
 */

const app = express();

// HTTPS option
// const sslServer = https.createServer(options, app);
// const io = require('socket.io')(sslServer);

// const socketIoPort = 8082;
// const ioSocket = require('socket.io')(socketIoPort);

// const socketIoPort = 8081;
// const server = require('http').Server(app);
// const io = require('socket.io')(socketIoPort);

const server = require('http').Server(app);
const io = require('socket.io')(server);
// var io  = require('socket.io')(http, { path: '/ui/socket.io'});

// const statusMonitor = require('express-status-monitor')({ websocket: io, port: app.get('port'), path: '' });

const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
const uiController = require('./controllers/ui');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// const statusMonitor = require('express-status-monitor')({ websocket: io, port: app.get('port'), path: '' });

// app.use(statusMonitor.middleware);
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
// 31557600000 is 24 * 3600 * 365.25 * 1000 Which is the length of a year, the length of a year is 365 days and 6 hours which is 0.25 day.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/home', homeController.index);
app.get('/ui', uiController.index);
app.get('/uiedit', userController.getUiedit);



app.get('/', userController.getLogin);
app.post('/', userController.postLogin);

// app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);

app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);

app.get('/account/list-edit', passportConfig.isAuthenticated, userController.getListEdit);
app.post('/account/profile-edit', passportConfig.isAuthenticated, userController.postProfileEdit);

app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

// app.get('/status', passportConfig.isAuthenticated, statusMonitor.pageRoute);


/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
app.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
app.get('/api/google-maps', apiController.getGoogleMaps);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/tumblr');
});
app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
app.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api/pinterest');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
 server.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode ##open in incognito mode to make sure page work', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;

// const fps_nsp = io.of('/fps-namespace');
// fps_nsp.on('connection', (socket) => {
//   // socket.emit('fps_com', { hello: 'Hey there browser!' });
//   console.log("connection");
//
//   socket.on('fps_com', (data) => {
//     console.log(data);
//     fps_nsp.emit('fps_com', {'fps': 'cmd'});
//   });
//
//   socket.on('ui_com', (data) => {
//     console.log(data);
//     fps_nsp.emit('ui_com', {'uixxx': 'uiyyy'});
//   });
//
//   socket.on('disconnect', () => {
//     console.log('Socket disconnected');
//   });
// });

io.on('connection', (socket) => {
  // console.log("incomming connection");
  io.emit('ui_com', {msg: 'SERVER >>> standby for ui_com'});
  // recieve command from client then pass to fps_com
  socket.on('ui_com', (data) => {
    if (data.msg == 'add'){
      console.log("recieve add msg from ui "+data.msg);
      io.emit('fps_com', { msg: 'add' });
    }else if (data.msg == 'delete') {
      console.log("recieve delete msg from ui : " + data.msg);
      console.log("recieve delete data from ui : " + data.data);
      io.emit('fps_com', { msg: 'delete', data: data.data });
    }else {
      console.log("recieve some msg from ui : " + data.msg);
      console.log("recieve some data from ui : " + data.data);
    }
  });
  io.emit('fps_com', { msg: 'SERVER >>> standby for fps_com' ,data:1});
  socket.on('fps_com', (data) => {
    if (data.msg == 'Enrolled Successfull') {
      // console.log("new user added");
      // console.log(data.data);
      const user = new User({
        fingerId: data.data
      });
      User.findOne({fingerId: data.data}, (err, existingUser) => {
        if (err) { console.log(err); }
        if (existingUser) {
          console.log('fingerId already exists.');
        }
        user.save((err) => {
          if (err) {
            console.log('on save database error : ' + err);
          }else {
            User.findOne({ fingerId: data.data}, function (err, obj){
              io.emit('ui_com', { msg: 'Enrolled confirm', data:obj.profile.name});
            });
          }
        });
      });
    } else if (data.msg == 'Delete Successfull') {
      User.findOne({ fingerId: data.data}, function (err, obj){
        User.remove({ _id: obj._id }, function(err) {
          if (!err) {
            console.log("Delete Successfull confirm : "+obj._id);
            io.emit('ui_com', { msg: 'Delete confirm', data:obj.profile.name});
          }
          else {
            console.log(err);
          }
        });
      });
    }else if (data.msg == 'verified Successfull') {
      User.findOne({ fingerId: data.data}, function (err, obj){
        console.log(obj.isAdmin);
        if(obj.isAdmin){
          io.emit('ui_com', { msg: 'verified admin', data:obj.profile.name});
          // console.log(typeof obj.profile.name);
          // console.log(obj.profile.name);
        }else {
          io.emit('ui_com', { msg: 'verified user', data:obj.profile.name});
        }
      });
    }else if (data.msg == 'verified Failed') {
      io.emit('ui_com', { msg: 'verified Failed'});
    }else if(data.msg.substring(0, 4)=='Fail'){
      io.emit('ui_com', { msg: data.msg});
    }else{
      console.log("uncaught fps socket msg : "+data.msg);
    }

  });

  socket.on('disconnect', () => {
    console.log('<<< Socket disconnected');
  });
});

// io.on('connection', (socket) => {
//   var data_ui
//   // console.log("incomming connection");
//   socket.emit('ui_com', { msg: 'SERVER >>> standby for ui_com' });
//   socket.on('ui_com', (data) => {
//     console.log('ui_com ' + data);
//     socket.emit('ui_com', "data_ui");
//   });
//
//
//   socket.on('disconnect', () => {
//     console.log('Socket disconnected');
//   });
// });
