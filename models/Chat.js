import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Storing messages as an embedded subdocument array for quick retrieval
    messages: [ChatMessageSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ChatSession', ChatSessionSchema);