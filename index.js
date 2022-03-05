require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

let access_token = null;
let refresh_token = null;
let count = 0;

const redirectUri = "https://a9f3-142-126-105-252.ngrok.io/oauth-callback";
const serverAddr = encodeURI(redirectUri);
const redirectUri2 = "https://a9f3-142-126-105-252.ngrok.io";
const serverAddr2 = encodeURI(redirectUri2);

const altAddr = 'https://apple.com'

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://api.login.yahoo.com/oauth2/request_auth',
  tokenURL: 'https://api.login.yahoo.com/oauth2/get_token',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://a9f3-142-126-105-252.ngrok.io/oauth-callback"
},
function(accessToken, refreshToken, profile, cb) {
  console.log("reached here :)");
  console.log("access token: " + accessToken);
  console.log("refresh token: " + refreshToken);
}
));

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

const redirectAddress = 
`https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${serverAddr}&response_type=code&language=en-us`;

const encodedclientId = Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64");

app.get('/auth',
  passport.authenticate('oauth2'));

app.get('/oauth-callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("success?");
    // Successful authentication, redirect home.
    res.redirect('/?what=1');
  });

app.get('/auth', (req, res) => {
  console.log("app.get auth");
  res.redirect(redirectAddress,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: altAddr,
    code,
    grant_type: "authorization_code",
  };
  const opts = { headers: { 
    Authorization: `Basic ${encodedclientId}`,
    "Content-Type": "application/x-www-form-urlencoded",  
  } };
  console.log("app.get auth-callback + axios");
  //console.log(opts);
  //console.log(body);
  console.log(count);
  console.log(access_token)
  count ++;
  axios
    .post('https://api.login.yahoo.com/oauth2/get_token', body, opts)
    .then((_res) => {
      console.log("roken:");
      console.log(_res);
    }, (error) => {
      console.log("callback error :(");
      console.log(error);
    });
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');
