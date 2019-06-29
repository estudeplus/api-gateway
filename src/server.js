'use strict'

const axios = require('axios');
const mongoose = require('mongoose')
const EventEmitter = require('events')
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users.js')
const startMongo = require('../config/mongo.js').startMongo
const RegisterEmitter = require('../events/registerEmitter.js')
const LogEmitter = require('../events/logEmitter.js')
const verifyJWT = require('./auth.js')
const LogModel = require('../models/logs.js')

const { ServicePool } = require('../lib/service.js')

const { PORT } = process.env
const { KEY } = process.env

const registerEmitter = new RegisterEmitter()
const logEmitter = new LogEmitter()
const app = express()

app.use(bodyParser());

var servicesInfo = {
  profile: process.env.PROFILE_URL,
  monitoring: process.env.MONITORING_URL,
  subject: process.env.SUBJECT_URL,
}

const servicePool = new ServicePool(servicesInfo)

servicePool.availableServices.forEach((serviceName) => {

  app.get(`/${serviceName}*`, (req, res) => {
    var servicePath = `/${serviceName}`
    var url = req.url.split(servicePath)[1]
    var options = {
      url: url,
      headers: req.headers,
      method: req.method
    }
    const server = servicePool.acquire(serviceName)

    server.client.request(options)
      .then((response) => {
        res.send(response.data)
      })
      .catch((err) => {
        res.send(err)
      })

    const logData = {
      origin: req.hostname,
      target: server.baseUrl + url,
      date: Date.now()
    }

    logEmitter.emit(logData)
    servicePool.release(server)
  })

  app.post(`/${serviceName}*`, (req, res) => {
    var servicePath = `/${serviceName}`
    var url = req.url.split(servicePath)[1]

    var options = {
      url: url,
      headers: req.headers,
      method: req.method,
      data: req.body
    }
    const server = servicePool.acquire(serviceName)

    server.client.request(options)
      .then((response) => {
        res.status(response.status).send(response.data)
      })
      .catch((err) => {
        res.status(err.response.status).send(err.response.data)
      })

      
    const logData = {
      origin: req.hostname,
      target: server.baseUrl + url,
      date: Date.now()
    }

    logEmitter.emit(logData)
    servicePool.release(server)
  })
})

app.get('/', (req, res) => {
    res.send({'status': 'ok'})
})

app.post('/login', (req, res, next) => {
  UserModel.findOne({ email: req.body.email})
    .then((user) => {
      if(!user){
          return res.json(404, {
            msg: 'User not found',
          });
        }
        var result = bcrypt.compareSync(req.body.password, user.password)
        if (!result) {
          return res.json(401, {
            error: 'Wrong credentials',
          });
        }
        const token = jwt.sign({ user }, KEY,
          { expiresIn: '1h' },
        );
        return res.json(200, {
          token,
        });
    });
});

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
