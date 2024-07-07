// express instance
const express = require('express');

// create router
const router = express.Router();

// Import the Model
const Post = require("../models/Post");

// API router
// GET method
router.get('', async (req, res) => {
    try{
        const posts = await Post.find();
        res.status(200).send(posts.json());
    }
    catch(error){
        res.status(400).send("Error: " + error);
    }
});

// GET posts by particular user
router.get('/:id', async ( req, res ) => {

});

// POST method
router.post('', async (req, res) => {
    // create a new post
    const newPost = new Post({
        username: getUserId(req.token),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image
    });
    // insert the new document into collection
    try{
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    }
    catch(error){
        res.status(400).send("Error: " + error);
    }
});

// PUT method
router.put('', async (req, res) => {
    res.status(200).send('PUT method');
});

// DELETE method
router.delete('', async (req, res) => {
    res.status(200).send('DELETE method');
});

// PATCH method
router.patch('', async (req, res) => {
    res.status(200).send('PATCH method');
});

module.exports = router;