// require statements
const express = require('express')
const app = express()

// for mongodb atlas - needs to be right under express require statements
require("dotenv").config()

const mongoose = require('mongoose')

const port = process.env.PORT || 5000

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

// for routes
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

// connection
app.listen(port, () => console.log(`Server is running on port ${port}`))