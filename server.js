'use strict'

const express = require('express')
const app = express()
const WebProxy = require('./src/webProxy.js')
const Service = require('./src/service.js')

const { PORT } = process.env

app.get('/', (req, res) => {
    res.send({'status': 'ok'})
})

app.get('/proxy', (req, res) => {
    var options = {
        hostname: 'hello',
        port: 8000,
        path: req.url,
        method: req.method,
        headers: req.headers

    };
    var service = new Service(options)
    var web = new WebProxy(service)
    web.proxy(req, res)
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})
