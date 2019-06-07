const { MONGO_URL } = process.env

const mongoose = require('mongoose')

async function startMongo() {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    } catch(err) {
        throw err
    }

    console.log('Mongo connected')
}

exports.startMongo = startMongo
