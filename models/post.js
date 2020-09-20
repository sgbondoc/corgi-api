// require statement
const mongoose = require('mongoose')

// post schema
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        text: String,
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    }]
}, { timestamps: true })

mongoose.model('Post', PostSchema)