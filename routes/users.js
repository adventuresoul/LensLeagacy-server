// express instance
const express = require('express');

// Bcrypt instance for password hashing
const bcrypt = require('bcrypt'); 

// define a route for users
const router = express.Router();

// Import the User Model
const User = require('../models/User');

// Import methods from authentication module
const { generateToken, verifyToken } = require('../Utils/auth');
const { append } = require('express/lib/response');


// API methods
// GET method
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } 
    catch (error) {
        res.status(500).send("Error: " + error);
    }
});

// GET my profile, authenticated
router.get('/me', verifyToken, async (req, res) => {
    try {
        const query = { _id: req.user.userId };
        const user = await User.findOne(query);
        if (user) {
            res.status(200).json(user); // Send userProfile in the response
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Error: " + error);
    }
});

// GET particular user by id, through token
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const query = { _id: req.params.id };
        const user = await User.findOne(query);
        if (user) {
            res.status(200).json(user); // Send userProfile in the response
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Error: " + error);
    }
});

// POST method
router.post('', async (req, res) => {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    // creating a new User model
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        phone : req.body.phone,
        instagramUsername: req.body.instagramUsername,
        password : hashedPassword,
        profilePhotoUrl: req.body.profilePhotoUrl
    });

    // insert the document in collection
    try{
        const userAck = await newUser.save();
        res.status(200).json(userAck);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Error: " + error);
    }
});

// Login
router.post('/login', async (req, res) => {
    // get email and password from req.body
    const { email, password } = req.body;

    // authenticate the user
    try{
        const user = await User.findOne({ email: email });

        if(!user){
            return res.status(401).send('Invalid credentials');
        }
        
        // check for password matching
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // generate the token
        const token = generateToken(user);
        res.status(200).json({ token });
    }
    catch(error){
        res.status(500).send('Error logging in: ' + error.message);
    }
});


// PUT method
router.put('', verifyToken, async (req, res) => {
    const { name, email, phone, password } = req.body;
    const updateField = { name, email, phone, password };

    try {
        const user = await User.findOne({ email: req.user.userId });
        if (!user || req.user.userId !== user._id.toString()) {
            return res.status(404).send("User doesn't exist or you are not authorized to update this user");
        } else {
            await User.updateOne({ _id: user._id }, { $set: updateField });
            res.send("User updated successfully");
        }
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

// DELETE method
router.delete('', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }

        const deleteResult = await User.deleteOne({ _id: userId });
        res.status(200).send("User deleted successfully");
    } 
    catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send("Error: " + error.message);
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