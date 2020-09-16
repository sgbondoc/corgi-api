// require statements
require("dotenv").config()
const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 5000

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

// for models
require('./models/user')
require('./models/post')

// for controllers
app.use(require('./controllers/auth'))
app.use(require('./controllers/posts'))

// connection
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))