// require statements
const router = require('express').Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')


// get all posts by all users
router.get('/posts', requireLogin, (request, response) => {
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
    const { title, caption, url } = request.body
    if (!title || !caption || !url) {
        response.status(422).json({
            error: "These are required fields"})
    }
    request.user.password = undefined
    const post = new Post({
        title,
        caption,
        imageUrl: url,
        user: request.user
    })
    post.save().then(result => {
        response.json({ post: result })
    })
    .catch(err => {
        console.log(err)
    })
})

// get all posts by single user id
router.get('/myposts', requireLogin, (request, response) => {
    console.log(request.user)
    Post.find({ user: request.user._id })
    .populate('user', '_id name')
    .then(myPosts => {
        response.json({myPosts})
    })
    .catch(err => {
        console.log(err)
    })
})


module.exports = router