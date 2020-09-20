// require statements
const router = require('express').Router()
const controller = require('../controllers')
const requireLogin = require('../middleware/requireLogin')

// routes for messages
router.get('/messages', requireLogin, controller.messages.index)
router.post('/createmessage', requireLogin, controller.messages.create)
router.put('/reply', requireLogin, controller.messages.update)
router.delete('/deletemessage/:messageId', requireLogin, controller.messages.destroy)

// exports
module.exports = router