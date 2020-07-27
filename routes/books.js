const express = require('express');
const router = express.Router();

const UserExperience = require("../models/UserExperience");
const Book = require("../models/Book");
const User = require("../models/User");

router.get("/:id", (req,res) => {
    Book.findById(req.params.id)
        .populate("userExperiences")
        .then(bookInfo => {
            res.send({bookInfo})
        })
        .catch(err => {
            res.send({error: `Error in books controller show route: ${err}`});
        })
})

router.post("/", (req,res) => {
    Book.findOne({title: req.body.title})
    .then(foundBook => {
        if (foundBook && (foundBook.author == req.body.author)) {
            res.redirect(`/books/${foundBook._id}`)
        } else {
            Book.create(req.body)
            .then(createdBook => {
               res.redirect(`/books/${createdBook._id}`);
            })
            .catch(err => {
                res.send({error: `Error in books controller create route creating book: ${err}`})
            })
        }
    })
    .catch(err => {
        res.send({error: `Error in books controller create route finding book: ${err}`})
    })
})

module.exports = router;