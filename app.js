// console.log('Starting the server...');
const express = require('express');
const app = express();
const passport = require('passport');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const port = 4000;


// Set 'views' directory for your views
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set 'public' folder as the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Create a local strategy for Passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Replace this with actual user authentication logic using your user model
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

// Serialize and deserialize user for session management
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// Define a route to handle the login form submission
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirect to the dashboard on successful login
    failureRedirect: '/login',     // Redirect back to the login page on failed login
  })
);

// Define a route to render the login view
app.get('/login', (req, res) => {
  res.render('login');
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login'); // Redirect to login page if not authenticated
  }

  // Define a route to access the protected dashboard
  app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard');
  });
