// require statements
const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const key = process.env.JWT_SECRET


// sign up or register user
const register = (request, response) => {
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
}        

// login user
const login = (request, response) => {
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
}

// logout user
const logout = (request,response) => {
    if (!request.user) return response.json({
        message: "No user to log out"
    })

    request.logout()
    response.json({message: "User logged out"})
}

// utility function - developer use only
const verify = (request, response) => {

}

module.exports = {
    login,
    register,
    logout,
    verify
}