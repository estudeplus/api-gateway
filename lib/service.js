'use strict'

const axios = require('axios');
const EventEmitter = require('events')
const ScaleEmitter = require('../events/scalerEmmiter.js')

class Service {
  constructor(name, baseUrl) {
    this.name = name
    this.baseUrl = baseUrl
    this.client = this.createClient(baseUrl)
  }
  createClient(baseUrl) {
    return axios.create({ baseURL: baseUrl })
  }
}

class ServicePool  {
	constructor(servicesInfos){
		this.emitter = new ScaleEmitter()
		this.servicesInfos = servicesInfos
		this.availableServices = Object.keys(servicesInfos)
		this.servicesList = {}

		this.availableServices.forEach((service) => {
			this.servicesList[service] = []

			let s = new Service(service, servicesInfos[service])
			this.servicesList[service].push(s)
		})
	}

	acquire(serviceName) {
		if(this.servicesList[serviceName].length === 0){
			if(this.servicesInfos[serviceName] !== undefined) {
				console.log('Creating new service')
				let s = new Service(serviceName, servicesInfos[service])
				this.servicesList[service].push(s)
			}
		}
		return this.servicesList[serviceName].pop()
	}

	release(service) {
		this.servicesList[service.name].push(service)
		this.emitter.emit(service.name, this)
	}

}

module.exports = {
	Service: Service,
	ServicePool: ServicePool
}
