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

class ServicePool  {
	constructor(numMaxServices, servicesInfo){
		this.numMaxServices = numMaxServices
		const services = Objects.keys(servicesInfo)

		services.forEach((service) => {
			let s = new Service(service, servicesInfo[service])

			this.serviceList[service] = []
			this.servicesList[service].push(s)
		})
	}

	acquire(serviceName) {
		if(this.serviceList[serviceName].length === 0 ){
			// TODO: Create new
		}
		return this.serviceList[serviceName].pop()
	}

	release(service) {
		this.serviceList[service.name].push(service)
		// TODO: emit event
	}

}

module.exports = {
	Service: Service,
	ServicePool: ServicePool
}
