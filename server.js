'use strict'

const express = require('express')
const app = express()
const WebProxy = require('./src/webProxy.js')
const { PORT } = process.env

app.get('/', (req, res) => {
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

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})
