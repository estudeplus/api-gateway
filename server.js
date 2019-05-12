const express = require('express')
const app = express()
const { PORT } = process.env

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})
