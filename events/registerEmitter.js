const bcrypt = require('bcrypt')
const EventEmitter = require('events')
const UserModel = require('../models/users.js')

class RegisterEmitter extends EventEmitter {
    constructor() {
        super()
        this._eventType = 'newRegister'
        this.on(this._eventType, this.addNewUser)
    }

    addNewUser(data) {
      bcrypt.hash(data.password, 10). then((hash) => {
        const user = new UserModel({
          email: data.email,
          uuid: data.uuid,
          password: hash,
      })
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
