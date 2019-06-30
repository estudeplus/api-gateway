'use strict'

const EventEmitter = require('events')

class ScaleEmitter extends EventEmitter {
  constructor() {
    super()
		this._eventRelease = 'releaseService'
    this.on(this._eventRelease, this.scaleDownServices)
  }

	scaleDownServices(serviceName, servicePool) {
		if(servicePool.servicesList[serviceName].length > 1) {
      console.log('Releasing service')
			delete servicePool.servicesList[serviceName].pop()
		}
	}

  emit(serviceName, servicePool) {
    super.emit(this._eventType, serviceName, servicePool)
  }
}

module.exports = ScaleEmitter
