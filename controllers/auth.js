// require statements
const router = require('express').Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const key = process.env.JWT_SECRET
const requireLogin = require('../middleware/requireLogin')


// sign up or register user
router.post('/register', (request, response) => {
    const { name, email, password } = request.body
    if (!name || !email || !password) {
        return response.status(422).json({
            error: "Please enter a name, email, and password"})
    } 

    User.findOne({ email: email })
    .then((savedUser) => {
        if (savedUser) {
            return response.status(422).json({
                error: "A user with that email already exists"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User({
                name,
                email,
                password: hashedpassword
            })
            user.save()
            .then(user => {
                response.json({message: "Saved successfully"})
            })
            .catch(err => {
                console.log(err)
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
})        

// login user
router.post('/login', (request, response) => {
    const { email, password } = request.body
    if (!email || !password) {
        return response.status(422).json({
            error: "Please add email or password"})
    }

    User.findOne({ email: email })
    .then(savedUser => {
        if (!savedUser) {
            return response.status(422).json({error: "Invalid credentials"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if (doMatch) {
                // user successfully logged in and token is assigned
                const token = jwt.sign({_id: savedUser._id}, key)
                const { _id, name, email } = savedUser
                response.json({token, user: { _id, name, email }})
            } else {
                return response.status(422).json({error: "Invalid credentials" })
            }
        })
        .catch(err => {
            console.log(err)
        })    
    })    
})


module.exports = router