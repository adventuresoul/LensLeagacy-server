const mongoose = require('mongoose');

// user collection schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true}
});


// creating collection
module.exports = mongoose.model('User', userSchema);
