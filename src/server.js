'use strict'

const axios = require('axios');
const mongoose = require('mongoose')
const EventEmitter = require('events')
const express = require('express')
const bodyParser = require('body-parser')

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
  profile: process.env.PROFILE_URL,
  monitoring: process.env.MONITORING_URL,
  subject: process.env.SUBJECT_URL,
}

var services = Object.keys(servicesInfo)

services.forEach((server) => {

  var servicePath = `/${server}`
	var baseURL =  servicesInfo[server]
	var api = axios.create({ baseURL: baseURL})

  app.get(`${servicePath}*`, (req, res) => {
    var url = req.url.split(servicePath)[1]
    var options = {
      url: url,
      headers: req.headers,
      method: req.method
    }

		api.request(options)
			.then((response) => {
				res.send(response.data)
			})
			.catch((err) => {
				res.send(err)
			})
			
    const logData = {
      origin: req.hostname,
      target: baseURL + url,
      date: Date.now()
    }

    logEmitter.emit(logData)
  })

  app.post(`${servicePath}*`, (req, res) => {
    var url = req.url.split(servicePath)[1]

    var options = {
      url: url,
      headers: req.headers,
      method: req.method,
			data: req.body
    }

		api.request(options)
			.then((response) => {
				res.status(response.status).send(response.data)
			})
			.catch((err) => {
				res.status(err.response.status).send(err.response.data)
			})
			
    const logData = {
      origin: req.hostname,
      target: baseURL + url,
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
