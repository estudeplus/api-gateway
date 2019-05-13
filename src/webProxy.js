'use strict'

const http = require('http')

class WebProxy {

    constructor(options) {
        /* 
            Example of options:
            options = {
                hostname: 'localhost',
                port: 80,
                path: '/',
                method: 'GET',
                headers: {}
            }
            docs: https://nodejs.org/api/http.html#http_http_request_options_callback
        */
        if(typeof(options) !== 'object') {
            return new Error("options must be an object") 
        }
        this._options = options
    }

    requestOnTarget(clientResponse) {
        const targetResponse = http.request(this._options, (res) => {
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
