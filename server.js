'use strict'

const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const WebProxy = require('./src/webProxy.js')
const { PORT } = process.env

app.get('/', verifyJWT, (req, res, next) => {
    var options = {
        hostname: 'hello',
        port: 8000,
        path: req.url,
        method: req.method,
        headers: req.headers

    };
    var web = new WebProxy(options)
    web.proxy(req, res)
})

app.post('/login', (req, res, next) => {
  //this user need be dynamic
  const user ={
    id: "1",
    username: 'username'
  }
    var token = jwt.sign({user: user}, 'secretarg', {
      expiresIn: 300 // expires in 5min
    });
    res.status(200).send({ auth: true, token: token });

  res.status(500).send('Invalid login!');
})

function verifyJWT(req, res, next){
  //verify if has token on header
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, 'secretarg', function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    next();
  });
}

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})
