'use strict'

class Service {
    constructor(options){
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

        if(typeof(options) != 'object'){
            var message = "args must be an object"
            console.log(message)
            throw new Error(message) 
        }

        const requiredKeys = [ 'hostname', 'port', 'path', 'method' ]

        const optionsKeys = Object.keys(options)

        requiredKeys.forEach((key) => {
            if(!key in requiredKeys) {
                throw new Error(`${key} is missing on args`)
            }

        })

        this._options = options
    }

    options() {
        return this._options
    }
}

module.exports = Service