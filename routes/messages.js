// require statements
const router = require('express').Router()
const mongoose = require('mongoose')
const Message = mongoose.model('Message')
const requireLogin = require('../middleware/requireLogin')
const { request } = require('express')

// get all messages by all users
router.get('/messages', requireLogin, (request, response) => {
    Message.find()
    .populate('user', '_id name')
    .populate('replies.user', '_id name')
    .then(messages => {
        response.json({ messages })
    })
    .catch(err => {
        console.log(err)
    })
})

// create message
router.post('/createmessage', requireLogin, (request, response) => {
    const { subject, body } = request.body
    if (!subject || !body) {
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

// delete message created by user id
router.delete('/deletemessage/:messageId', requireLogin, (request, response) => {
    Message.findOne({ _id: request.params.messageId })
    .populate('user', '_id')
    .exec((err, message) => {
        if (err || !message) {
            return response.status(422).json({error: err})
        }
        if (message.user._id.toString() === request.user._id.toString()) {
            message.remove()
            .then(result => {
                response.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

// add replies to messages
router.put('/reply', requireLogin, (request, response) => {
    const reply = {
        text: request.body.text,
        user: request.user._id
    }
    Message.findByIdAndUpdate(request.body.messageId, {
        $push: { replies: reply }
    }, {new: true})
    .populate('replies.user', '_id name')
    .populate('user', '_id name')
    .exec((err, result) => {
        if (err) {
            return response.status(422).json({ error: err })
        } else {
            response.json(result)
        }
    })
})

module.exports = router