// require statements
const router = require('express').Router()
const mongoose = require('mongoose')
const Message = mongoose.model('Message')
const requireLogin = require('../middleware/requireLogin')

// get all messages by all users
router.get('/messages', requireLogin, (request, response) => {
    Message.find()
    .populate('user', '_id name')
    .then(messages => {
        response.json({messages})
    })
    .catch(err => {
        console.log(err)
    })
})

// create message
router.post('/createmessage', requireLogin, (request, response) => {
    const { title, caption, url } = request.body
    if (!title || !caption || !url) {
        response.status(422).json({
            error: "These are required fields"})
    }
    request.user.password = undefined
    const message = new Message({
        subject,
        body,
        user: request.user
    })
    message.save().then(result => {
        response.json({ message: result })
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router