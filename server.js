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

  res.status(500).send('Login inválido!');
})


app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})
