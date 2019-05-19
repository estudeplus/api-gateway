'use strict'

const http = require('http')
const Service = require('./service.js')

class WebProxy {

    constructor(service) {
        if(!service instanceof Service) {
            return new Error("args must be an instance of Service") 
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
			return err
		})

        return targetResponse 
    }

	proxy(clientRequest, clientResponse) {
		const targetResponse = this.requestOnTarget(clientResponse)	

		clientRequest.pipe(targetResponse, {
			end: true
		})
	}
}

module.exports = WebProxy
