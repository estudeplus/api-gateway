'use strict'

const axios = require('axios');
const EventEmitter = require('events')

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

class ServicePool  {
	constructor(servicesInfos){
		this.emitter = EventEmmiter()
		this.servicesInfos = servicesInfos
		this._eventRelease = 'releaseService'
		this.emitter.on(this._eventRelease, this.scaleDownServices(serviceName))

		const services = Objects.keys(servicesInfos)

		services.forEach((service) => {
			this.serviceList[service] = []

			let s = new Service(service, servicesInfos[service])
			this.servicesList[service].push(s)
		})
	}

	acquire(serviceName) {
		if(this.serviceList[serviceName].length === 0){
			if(this.servicesInfos[serviceName] !== undefined) {
				let s = new Service(serviceName, servicesInfos[service])
				this.servicesList[service].push(s)
			}
		}
		return this.serviceList[serviceName].pop()
	}

	release(service) {
		this.serviceList[service.name].push(service)
		this.emmiter.emit(this._eventRelease, service.name)
	}

	scaleDownServices(serviceName) {
		if(this.serviceList[serviceName].length > 1) {
			delete this.serviceList[serviceName].pop()
		}
	}
}

module.exports = {
	Service: Service,
	ServicePool: ServicePool
}
