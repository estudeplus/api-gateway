'use strict'

const mongoose = require('mongoose')
const EventEmitter = require('events')
const express = require('express')
const bodyParser = require('body-parser')

const WebProxy = require('../lib/webProxy.js')
const Service = require('../lib/service.js')
const startMongo = require('../config/mongo.js').startMongo
const RegisterEmitter = require('../events/registerEmitter.js')
const LogEmitter = require('../events/logEmitter.js')
const verifyJWT = require('./auth.js')
const LogModel = require('../models/logs.js')

const { PORT } = process.env
const { KEY } = process.env

const registerEmitter = new RegisterEmitter()
const logEmitter = new LogEmitter()
const app = express()

app.use(bodyParser());

var servicesInfo = {
  profile: {
    host: process.env.PROFILE_HOST,
    port: process.env.PROFILE_PORT
  },
  monitoring: {
    host: process.env.MONITORING_HOST,
    port: process.env.MONITORING_PORT
  },
  subject: {
    host: process.env.SUBJECT_HOST,
    port: process.env.SUBJECT_PORT
  }
}

var services = Object.keys(servicesInfo)

services.forEach((server) => {

  var servicePath = `/${server}`

  app.get(`${servicePath}*`, (req, res) => {
    var url = req.url.split(servicePath)[1]
    var options = {
      hostname: servicesInfo[server].host,
      port: servicesInfo[server].port,
      path: url,
      headers: req.headers,
    }

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

  app.post(`${servicePath}*`, (req, res) => {
    var url = req.url.split(servicePath)[1]

    var options = {
      hostname: servicesInfo[server].host,
      port: servicesInfo[server].port,
      path: url,
      headers: req.headers,
    }

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
})

app.get('/', (req, res) => {
    res.send({'status': 'ok'})
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

app.get('/logs', (req, res) => {
  LogModel.find({}, (err, logs) => {
    if(err) {
      res.send({error: err})
    }
    res.send(logs)
  })
})

app.listen(PORT, async () => {
    try {
        await startMongo()
    } catch(err) {
        console.log(err)
        process.exit(1)
    }

    console.log('Server running on port ' + PORT)
})
