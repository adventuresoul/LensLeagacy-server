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
    const { username, email, phone, instagramUsername, password, profilePhotoUrl } = req.body;
    const updateFields = {};


    // only change whatever modifications have come from frontend
    if (username) {
        updateFields.username = username;
    }
    if (email) {
        updateFields.email = email;
    }
    if (phone) {
        updateFields.phone = phone;
    }
    if (instagramUsername) {
        updateFields.instagramUsername = instagramUsername;
    }
    if (profilePhotoUrl) {
        updateFields.profilePhotoUrl = profilePhotoUrl;
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, salt);
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // authorized user only to update their own profile
        if (req.user.userId !== user._id.toString()) {
            return res.status(403).send("You are not authorized to update this user");
        }

        // Update the user with the new fields
        const updatedUser = await User.findByIdAndUpdate(req.user.userId, { $set: updateFields }, { new: true, runValidators: true });

        res.status(200).json(updatedUser);
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



// export the users route
module.exports = router;