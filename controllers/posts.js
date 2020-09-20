// require statements
const router = require('express').Router()
const Post = require('../models/post')


// get all posts by all users
const index = (request, response) => {
    Post.find()
    .populate('user', '_id name')
    .populate('comments.user', '_id name')
    .sort('-createdAt')
    .then(posts => {
        response.json({ posts })
    })
    .catch(err => { console.log(err) })
}

// create post
const create = (request, response) => {
    const { title, caption, url } = request.body
    if (!title || !caption || !url) {
        response.json({
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
    .catch(err => { console.log(err) })
}

// get all posts by single user id
const show = (request, response) => {
    console.log(request.user)
    Post.find({ user: request.user._id })
    .populate('user', '_id name')
    .then(myPosts => {
        response.json({ myPosts })
    })
    .catch(err => {
        console.log(err)
    })
}

// delete post created by user id
const destroy = (request, response) => {
    Post.findOne({ _id: request.params.postId })
    .populate('user', '_id')
    .exec((err, post) => {
        if (err || !post) {
            return response.json({ error: err })
        }
        if (post.user._id.toString() === request.user._id.toString()) {
            post.remove()
            .then(result => {
                response.json(result)
            }).catch(err => { console.log(err) })
        }
    })
}

// add comments to posts
const update = (request, response) => {
    const comment = {
        text: request.body.text,
        user: request.user._id
    }
    Post.findByIdAndUpdate(request.body.postId, {
        $push: { comments: comment }
    }, {new: true})
    .populate('comments.user', '_id name')
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
    show,
    create,
    update,
    destroy
}