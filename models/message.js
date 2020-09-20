// require statement
const mongoose = require('mongoose')

// message schema
const MessageSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    replies: [{
        text: String,
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    }]
}, { timestamps: true })

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message