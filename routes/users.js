require('dotenv').config()
const express = require('express')
const router = express.Router()
//const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// load User model
const User = require('../models/User')
const Book = require('../models/Book')
const UserExperience = require('../models/UserExperience')

//API ROUTES
//user test route
router.get('/test', function(req, res) {
    res.json({msg: "Users route working"})
})
//Get a user by id for profiles
router.get('/user/:id', (req, res) => {
    User.findById({ id: req.params.id })
        .then(user => {
            Book.find({ userId: user.id })
                .then(userBooks => {
                    UserExperience.find({ userId: user.id})
                        .then(foundUserExperience => {
                            res.send({user}, {userBooks}, {foundUserExperience})
                        })
                        .catch(err => {
                            console.log(`Error finding UserExperiences: ${err}`)
                        })
                })
                .catch(err => {
                    console.log(`Error finding user Books: ${err}`)
                })
        })
        .catch(err => {
            console.log(`Error finding User: ${err}`)
        })
})


//GET route to handle registration
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'Email already exists'})
            } else {
                // const avatar = gravatar.url(req.body.email, {
                //     s: '200',
                //     r: 'pg',
                //     d: 'mm'
                // })
                const newUser = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    user_name: req.body.user_name,
                    email: req.body.email,
                    password: req.body.password,
                    //avatar
                    
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err
                        }
                        newUser.password = hash
                        newUser.save()
                            //delete json send for security long term
                            .then(user => res.status(207).json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

router.post('/login', function(req, res) {
    const email = req.body.email
    const password = req.body.password

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ email: "User not found" })
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, first_name: user.fist_name, last_name: user.last_name, user_name: user.user_name }
                        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 3600 }, (err, token) => {
                            res.json({ sucess: true, token: 'Bearer ' + token })
                        })
                    } else {
                        return res.status(400).json({ password: 'Password is incorrect.'})
                    }
                })
        })
})

//GET log people in and check their credentials against existing User data
//GET if already logged in, set user data to current
module.exports = router