'use strict'

class Service {
    constructor(options){
        this._options = options
    }

    options() {
        return this._options
    }
}

module.exports = Service
