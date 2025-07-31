const Session = require('../models/Session');
const Question = require('../models/Question');

// Create a session with optional questions
const createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions = [] } = req.body;
        const userId = req.user._id;

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
            questions: [] // temporary, will be updated
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const created = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                });
                return created._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({
            success: true,
            message: "Session created successfully",
            session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get sessions for the logged-in user
const getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("questions");

        res.status(200).json({
            success: true,
            message: "Sessions retrieved successfully",
            sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get a single session by ID
const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: "questions",
                options: { sort: { isPinned: -1, createdAt: -1 } }
            });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Session retrieved successfully",
            session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete a session and its questions
const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized to delete this session"
            });
        }

        await Question.deleteMany({ session: session._id });
        await session.deleteOne();

        res.status(200).json({
            success: true,
            message: "Session deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    createSession,
    getMySessions,
    getSessionById,
    deleteSession
};
