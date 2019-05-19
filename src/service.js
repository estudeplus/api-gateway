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
        this._options = options
    }

    options() {
        return this._options
    }
}

module.exports = Service
