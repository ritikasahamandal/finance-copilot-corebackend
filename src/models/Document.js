const mongoose = require('mongoose');
const User = require('./User');

const DocumentSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url:{
        type: String,
        required:[true, 'Please provide url'],
        trim:true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    title: {
        type: String,
        default: 'Analyzing financial source...'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.export = mongoose.model('Document', DocumentSchema)