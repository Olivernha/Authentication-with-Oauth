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
    CLIENT_SECRET: config.CLIENT_SECRET
};
function verifyCallback(accessToken,refreshToken,profile,done){
    console.log('Google profile',profile);
    done(null,profile);
}
passport.use(
  new Strategy(AUTH_OPTIONS,verifyCallback)
);
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
app.get("/auth/google", (req, res) => {});
app.get("/auth/google/callback", (req, res) => {});
app.get("/auth/logout", (req, res) => {});
app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("secret page");
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
