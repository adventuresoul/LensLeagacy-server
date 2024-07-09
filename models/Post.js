const { contentType } = require('express/lib/response');
const mongoose = require('mongoose');

// Post collection model
const PostSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['wildlife', 'wedding', 'portrait', 'city', 'street'], required: true },
    imageLink: { type: String, required: true }
});

// creating collection
module.exports = mongoose.Model.Post || mongoose.model('Post', PostSchema);