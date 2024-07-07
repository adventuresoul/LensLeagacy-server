const { contentType } = require('express/lib/response');
const mongoose = require('mongoose');

// Post collection model
const PostSchema = new mongoose.Schema({
    username: { type: String, required: true },
    title: { type: String, requires: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['wildlife', 'wedding', 'portrait', 'city', 'street','model'], required: true },
    image: { data: Buffer, contentType: String }
});

// creating collection
module.exports = mongoose.model('Post', PostSchema);