// express and multer instance
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// create router
const router = express.Router();

// Import the Model
const Post = require("../models/Post");
const User = require("../models/User");

// import methods authentication module
const { generateToken, verifyToken } = require('../Utils/auth');
const { append } = require('express/lib/response');

// API router
// GET method
router.get('', verifyToken, async (req, res) => {
    try{
        const posts = await Post.find();

        // Fisher-Yates (Knuth) Shuffle
        for (let i = posts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [posts[i], posts[j]] = [posts[j], posts[i]];
        }

        res.status(200).json(posts);
    }
    catch(error){
        res.status(400).send("Error: " + error);
    }
});

// Get current user posts
router.get('/me', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.userId });
        res.json(posts);
    } 
    catch (error) {
        res.status(400).send("Error: " + error);
    }
});

// Get posts of user with  particular id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id });
        res.json(posts);
    } 
    catch (error) {
        res.status(400).send("Error: " + error);
    }
});

// POST method
router.post('', verifyToken, async (req, res) => {
    // creating a new User model
    const newPost = new Post({
        userId: req.user.userId,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        imageLink: req.body.imageLink
    });

    // insert the document in collection
    try{
        const postAck = await newPost.save();
        res.status(200).json(postAck);
    }
    catch(error){
        res.status(500).send("Error: " + error);
    }
});

// PUT method
router.put('', async (req, res) => {
    res.status(200).send('PUT method');
});

// DELETE method
router.delete('/:postId', verifyToken, async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        console.log(req.user.userId, post.userId);
        if(post.userId != req.user.userId){
            res.status(404).send("Cannot delete the post");
        }
        else{
            await Post.deleteOne({_id: req.params.postId});
            res.status(200).send("Deleted succesfully");
        }
    }
    catch(error){
        console.log('Error: ' + error);
        res.status(500).send("Error: " + error);
    }
});

// PATCH method
router.patch('', async (req, res) => {
    res.status(200).send('PATCH method');
});

module.exports = router;