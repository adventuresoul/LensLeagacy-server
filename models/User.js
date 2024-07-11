const mongoose = require('mongoose');

// user collection schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: [true, "Email exists"] },
    phone: { type: String, required: true },
    instagramUsername: { type: String, required: true },
    password: { type: String, required: true},
    profilePhotoUrl: { type: String, required: true }
});


// creating collection
// It will create schema if it not exists
module.exports = mongoose.Model.User || mongoose.model('User', userSchema);
