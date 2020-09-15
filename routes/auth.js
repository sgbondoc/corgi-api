// require statements
const router = require('express').Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')


router.get('/', (request, response) => {
    response.send("hello")
})

router.post('/register', (request,response) => {
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
        const user = new User({
            name,
            email,
            password
        })
        user.save()
        .then(user => {
            response.json({message: "Saved successfully"})
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
})        
      
    

module.exports = router