require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

const redirectUri = "oob";
const serverAddr = encodeURI(redirectUri);
console.log(redirectUri);
console.log(serverAddr);


const redirectAddress = 
`https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${serverAddr}&response_type=code&language=en-us`;

app.get('/auth', (req, res) => {
  console.log("app.get auth");
  res.redirect(redirectAddress,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };
  const opts = { headers: { accept: 'application/json' } };
  console.log("app.get auth-callback + axios");
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
