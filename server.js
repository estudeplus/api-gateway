'use strict'

const mongoose = require('mongoose')
const EventEmitter = require('events')
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const WebProxy = require('./lib/webProxy.js')
const Service = require('./lib/service.js')
const startMongo = require('./src/mongo.js').startMongo
const emitter = new EventEmitter();
const UserModel = require('./src/model/users.js')

const { PORT } = process.env
const { KEY } = process.env

emitter.on('eventRegister', eventRegister(logindata))

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
  let logindata = req.body;
  emitter.emit('eventRegister', logindata);
  res.status(200)
})

function eventRegister(logindata){
  const user = new UserModel({uuid: logindata.uuid, email: logindata.email, pwd: logindata.password})
  user.save().then(()=>{
    return 0;
  })
  .catch((err)=>{
    throw err;
  })
}

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
    startMongo()
    console.log('Server running on port ' + PORT)
})
