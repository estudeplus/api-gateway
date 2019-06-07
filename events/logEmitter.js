const EventEmitter = require('events')
const LogModel = require('../models/logs.js')

class LogEmitter extends EventEmitter  {
    constructor() {
        super()
        this._eventType = 'newLog'
        this.on(this._eventType, (data) => {
            setImmediate(() => {
                this.addNewLog(data);
            })
        })
    }

    addNewLog(data) {
        const log = new LogModel({
            origin: data.origin,
            target: data.target,
            targetStatus: data.targetStatus,
            date: data.date})

        log.save()
            .then(() => {
                console.log("Request Log saved!")
                return 0;
            })
            .catch((err) => {
                throw err;
            })
    }

    emit(data) {
        super.emit(this._eventType, data)
    }
}

module.exports = LogEmitter
