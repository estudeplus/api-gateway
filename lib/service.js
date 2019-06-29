'use strict'

const axios = require('axios');

class Service {
  constructor(name, baseUrl) {
    this.name = name
    this.servicePath = `/${name}`
    this.baseUrl = baseUrl
    this.client = createClient(baseUrl)
  }
  createClient(baseUrl) {
    return axios.create({ baseURL: baseUrl })
  }
}

module.exports = Service
