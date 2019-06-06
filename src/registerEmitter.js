const EventEmitter = require('events')
const UserModel = require('./model/users.js')

class RegisterEmitter extends EventEmitter {
    constructor() {
        super()
        this._eventType = 'newRegister'
        this.on(this._eventType, this.addNewUser)
    }

    addNewUser(data) {
        const user = new UserModel({
            uuid: data.uuid,
            email: data.email,
            pwd: data.password})

        user.save()
            .then(() => {
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

module.exports = RegisterEmitter
