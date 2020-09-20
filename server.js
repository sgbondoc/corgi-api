// require statements
require("dotenv").config()
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const PORT = process.env.PORT || 5000

const routes = require('./routes')

// app.use(function(request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*")
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//     next()
// })

const mongoose = require('mongoose')

// middleware JSON parsing
app.use(express.json())

// mongoose mongodb connections
const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/corgi"

const configOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

mongoose.connect(connectionString, configOptions)
    .then(() => console.log("MongoDB successfully connected", connectionString))
    .catch(err => console.log(`MongoDB connection error: ${err}`))

// middleware jwt
require('./middleware/requireLogin')

// middleware API routes
app.use('/', routes.posts)
app.use('/', routes.messages)
app.use('/', routes.auth)

// connection
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))