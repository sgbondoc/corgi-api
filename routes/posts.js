// require statements
const router = require('express').Router()
const controller = require('../controllers')
const requireLogin = require('../middleware/requireLogin')

// routes for posts
router.get('/posts', requireLogin, controller.posts.index)
router.get('/myposts', requireLogin, controller.posts.show)
router.post('/createpost', requireLogin, controller.posts.create)
router.put('/comment', requireLogin, controller.posts.update)
router.delete('/deletepost/:postId', requireLogin, controller.posts.destroy)

// exports
module.exports = router