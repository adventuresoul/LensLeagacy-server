// express instance
const express = require('express');

// define a route for users
const router = express.Router();

// Import the Model
const User = require('../models/User');

// API methods
// GET method
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } 
    catch (error) {
        res.status(500).send("Error: " + error);
    }
});

// GET particular user by id, through params
router.get('/:id', async (req, res) => {
    try {
        const query = { _id : req.params.id };
        const user = await User.find(query);
        if(user){
            res.json(user[0]);
        }
        else{
            res.status(404).send("User not found");
        }
        
    } 
    catch (error) {
        res.status(500).send("Error: " + error);
    }
});

// POST method
router.post('/', async (req, res) => {
    // creating a new User model
    const newUser = new User({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        password : req.body.password
    });
    // insert the document in collection
    try{
        const userAck = await newUser.save();
        res.status(200).json(userAck);
    }
    catch(error){
        res.status(500).send("Error: " + error);
    }
});


// PUT method
router.put('/:id', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try{
        const user = await User.findOne({ email: req.body.email });
        if (!user){
            res.status(404).send("User doesn't exist");
        }
        else{
            await User.updateOne({ email: req.body.email }, { $set: updateField });
            res.send("User updated succesfully");
        }
    }
    catch(error){
        res.status(500).send("Error: " + error);
    }
});

// DELETE method
router.delete('/:id', async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.params.id });
        if (!user){
            res.status(404).send("User doesn't exist");
        }
        else{
            await User.deleteOne({ _id: req.params.id });
            res.send("User deleted succesfully");
        }
    }
    catch(error){
        res.status(500).send("Error: " + error);
    }
});

// PATCH method
router.patch('/:id', async ( req, res ) => {
    const { name, email, phone, password } = req.body;
    const updateParams = {}
    if (name){
        updateField.name = name;
    }
    if (email){
        updateField.email = email;
    }
    if (phone) {
        updateField.phone = phone;
    }
    if (password) {
        updateField.password = password;
    }
    try{
        const user = await User.findOne({ _id: req.params.id });
        if(!user){
            return res.status(400).send("User doesn't exist");
        }
        await User.updateOne({ email: req.body.email }, { $set: updateField }, { new: true, runValidators: true });
        res.send("User updated succesfully");
    }
    catch (error){
        res.status(500).send("Error: " + error);
    }
});


// export the users route
module.exports = router;