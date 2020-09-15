// require statements
const router = require('express').Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')


// get all posts
router.get('/posts', (request, response) => {
    Post.find()
    .populate('user', '_id name')
    .then(posts => {
        response.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})


// create post
router.post('/createpost', requireLogin, (request, response) => {
    const { title, caption } = request.body
    if (!title || !caption) {
        response.status(422).json({
            error: "These are required fields"})
    }
    request.user.password = undefined
    const post = new Post({
        title,
        caption,
        user: request.user
    })
    post.save().then(result => {
        response.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })
})


module.exports = router