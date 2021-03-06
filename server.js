
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');


require('dotenv').config();
const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};
function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log('Google profile', profile);
  done(null, profile);
}
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser((id, done) => {
  // User.findById(id).then(user => {
  //   done(null, user);
  // });
  console.log('deserializeUser');
  done(null, id);
});
const app = express();

app.use(helmet());

app.use(cookieSession({
  name: 'session',
  maxAge: 24 * 60 * 60 * 1000,
  keys: [ config.COOKIE_KEY_1, config.COOKIE_KEY_2 ],
}));
app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next) {

  const isLoggedIn = req.user && req.isAuthenticated();
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must be logged in to view this page",
    });
  }
  next();
}
app.get("/auth/google", passport.authenticate('google',{
    scope: ['email' ],
   
}));
app.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/failure",
  successRedirect: "/",
  session: true,
}),(req,res)=>{
    console.log('Google auth success');
});
app.get("/failure", (req, res) => {
  return res.send("Failed to log in!");
});
app.get("/auth/logout", (req, res) => {
    req.logout(); //remove req.user and clear any logged in session
    return res.redirect("/");
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("secret page");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
