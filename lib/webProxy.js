'use strict'

const http = require('http')
const Service = require('./service.js')

class WebProxy {

    constructor(service) {
        if(!(service instanceof Service)) {
            var message = "Error: args must be an instance of Service"
            console.log(message)
            throw new Error(message) 
        }
        this._service = service 
    }

    requestOnTarget(clientResponse) {
        const options = this._service.options()
        const targetResponse = http.request(options, (res) => {
            clientResponse.writeHead(res.statusCode, res.headers)
            res.pipe(clientResponse, {
                end: true
            })

        })
		targetResponse.on('error', (err) => {
			console.log(err)		
            clientResponse.status(503).json({error: err.message})
			return err
		})

        return targetResponse 
    }

	proxy(clientRequest, clientResponse) {
    console.log(`Proxing to ${this._service.options().hostname}`)

		const targetResponse = this.requestOnTarget(clientResponse)	

		clientRequest.pipe(targetResponse, {
			end: true
		})
	}
}

module.exports = WebProxy
