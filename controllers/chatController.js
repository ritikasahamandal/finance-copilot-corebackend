import axios from 'axios';
import ChatSession from '../models/Chat.js';

// @desc    Send a question to the AI RAG Engine
// @route   POST /api/chat/query
export const queryAssistant = async (req, res) => {
    try {
        const { question } = req.body;
        const userId = req.user.id;

        if (!question) {
            return res.status(400).json({ success: false, message: 'Please provide a question' });
        }

        let aiAnswer = '';

        try {
            // 1. Send query to Python FastAPI AI service
            const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/query`, {
                user_id: userId,
                question: question
            });
            aiAnswer = aiResponse.data.answer;

        } catch (aiError) {
            console.error(`AI Engine Error: ${aiError.message}`);
            return res.status(502).json({ 
                success: false, 
                message: 'The AI Analysis service is currently offline. Please try again later.' 
            });
        }

        // 2. Save conversation chunks directly into MongoDB ChatSession
        let chatSession = await ChatSession.findOne({ user: userId });

        if (!chatSession) {
            // Create a brand new session if they haven't chatted before
            chatSession = new ChatSession({
                user: userId,
                messages: []
            });
        }

        // Push both the question and the generated answer into subdocument array
        chatSession.messages.push({ role: 'user', content: question });
        chatSession.messages.push({ role: 'assistant', content: aiAnswer });
        chatSession.updatedAt = Date.now();
        
        await chatSession.save();

        // 3. Return the AI's final answer to the React Frontend
        res.status(200).json({ success: true, answer: aiAnswer });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get chat history for user session
// @route   GET /api/chat/history
export const getChatHistory = async (req, res) => {
    try {
        const chatSession = await ChatSession.findOne({ user: req.user.id });
        if (!chatSession) {
            return res.status(200).json({ success: true, messages: [] });
        }
        res.status(200).json({ success: true, messages: chatSession.messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};