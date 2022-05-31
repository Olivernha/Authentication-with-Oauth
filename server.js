const path = require("path");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const PORT = 3000;
require("dotenv").config();
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};
const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};
function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  done(null, profile);
}
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));
const app = express();
app.use(passport.initialize());
app.use(helmet());
function checkLoggedIn(req, res, next) {
  const isLoggedIn = true;
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
  session:false
}),(req,res)=>{
    console.log('Google auth success');
});
app.get("/failure", (req, res) => {
  return res.send("Failed to log in!");
});
app.get("/auth/logout", (req, res) => {});
app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("secret page");
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
