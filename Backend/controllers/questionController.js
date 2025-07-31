const Question = require('../models/Question');
const Session = require('../models/Session');

const addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body;
        if(!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        const session = await Session.findById(sessionId);
    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }
    // create new questions 
    const createdQuestions = await Question.insertMany(questions.map((q) => ({
        session: sessionId,
        questionText: q.question,
        answer:q.answer,
    })));
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        
    }
}

const togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({success:false, message: 'Question not found' });
        }
        question.isPinned = !question.isPinned;
        await question.save();
        res.status(200).json({ success: true, message: 'Question pin status updated', question });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        
    }
}

const updateQuestionNote = async (req, res) => {
    try {
        const { note } = req.body;
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        question.note = note;
        await question.save();
        res.status(200).json({ success: true, message: 'Question note updated', question });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        
    }
}

module.exports = {
    addQuestionsToSession,
    togglePinQuestion,
    updateQuestionNote
};