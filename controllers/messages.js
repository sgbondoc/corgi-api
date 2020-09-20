// require statements
const router = require('express').Router()
const Message = require('../models/message')


// get all messages by all users
const index = (request, response) => {
    Message.find()
    .populate('user', '_id name')
    .populate('replies.user', '_id name')
    .sort('-createdAt')
    .then(messages => {
        response.json({ messages })
    })
    .catch(err => {console.log(err)})
}

// create message
const create = (request, response) => {
    const { subject, body } = request.body
    if (!subject || !body) {
        response.json({
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
}

// delete message created by user id
const destroy = (request, response) => {
    Message.findOne({ _id: request.params.messageId })
    .populate('user', '_id')
    .exec((err, message) => {
        if (err || !message) {
            return response.json({error: err})
        }
        if (message.user._id.toString() === request.user._id.toString()) {
            message.remove()
            .then(result => {
                response.json(result)
            }).catch(err => { console.log(err) })
        }
    })
}

// add replies to messages
const update = (request, response) => {
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
            return response.json({ error: err })
        } else {
            response.json(result)
        }
    })
}

module.exports = {
    index,
    create,
    update,
    destroy
}