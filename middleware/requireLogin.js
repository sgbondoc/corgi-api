// require statements
const jwt = require('jsonwebtoken')
const key = process.env.JWT_SECRET
const mongoose = require('mongoose')
const User = mongoose.model('User')

// middleware to verify user token
module.exports = (request, response, next) => {
    const {authorization} = request.headers
    if (!authorization) {
        return response.status(401).json({
            error: "User must be logged in"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, key, (err, payload) => {
        if (err) {
            return response.status(401).json({
                error: "User must be logged in"})
        }
        const {_id} = payload
        User.findById(_id).then(userData => {
            request.user = userData
        })
        next()
    })
}