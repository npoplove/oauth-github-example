require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

const redirectUri = "https://75a1-142-126-105-252.ngrok.io/oauth-callback/";
const redirectUri2 = "https://75a1-142-126-105-252.ngrok.io/";
const serverAddr = encodeURI(redirectUri);
console.log(redirectUri);
console.log(serverAddr);


const redirectAddress = 
`https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${serverAddr}&response_type=code&language=en-us`;

const encodedclientId = Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64');

app.get('/auth', (req, res) => {
  console.log("app.get auth");
  res.redirect(redirectAddress,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: redirectUri2,
    code,
    grant_type: "authorization_code"
  };
  const opts = { headers: { 
    Authorization: `Basic ${encodedclientId}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
  
  } };
  console.log("app.get auth-callback + axios");
  console.log(body);
  axios
    .post('https://api.login.yahoo.com/oauth2/get_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');
