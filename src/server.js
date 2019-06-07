'use strict'

const mongoose = require('mongoose')
const EventEmitter = require('events')
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
    
const WebProxy = require('../lib/webProxy.js')
const Service = require('../lib/service.js')
const startMongo = require('../config/mongo.js').startMongo
const RegisterEmitter = require('../events/registerEmitter.js')
const LogEmitter = require('../events/logEmitter.js')

const { PORT } = process.env
const { KEY } = process.env

const registerEmitter = new RegisterEmitter()
const logEmitter = new LogEmitter()
const app = express()

app.use(bodyParser());

app.get('/', (req, res) => {
    res.send({'status': 'ok'})
})

app.get('/proxy', verifyJWT, (req, res, next) => {
    var options = {
        hostname: 'hello',
        path: req.url,
        method: req.method,
        headers: req.headers

    };
    var service = new Service(options)
    var web = new WebProxy(service)

    web.proxy(req, res)

    const logData = {
        origin: req.hostname,
        target: options.hostname,
        date: Date.now()
    }

    logEmitter.emit(logData)

})

app.post('/login', (req, res, next) => {
  //this user need coming in jsonformat
  if(req.body.user === 'testUser' && req.body.pwd === 'testPwd'){
    //this id represent user in database
    const id = 1;
    var token = jwt.sign({ id }, KEY , {
      expiresIn: 300 // need make function for refresh the token after 300 sec
    });
    res.status(200).send({ auth: true, token: token });
  }
  res.status(500).send('Invalid login!');
})

app.post('/register', (req, res, next) =>   {
  let data = req.body;

  registerEmitter.emit(data)

  res.status(200).send({'message': 'Event received'})
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

app.listen(PORT, async () => {
    try {
        await startMongo()
    } catch(err) {
        console.log(err)
        process.exit(1)
    }

    console.log('Server running on port ' + PORT)
})
