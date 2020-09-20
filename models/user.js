// require statement
const mongoose = require('mongoose')

// user schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User