const { GoogleGenAI } = require('@google/genai');
const { conceptExplainPrompt, questionAnswerPrompt } = require('../utils/prompts')

const ai =  new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY, 
});

const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicToFocus, numberOfQuestions } = req.body;

        if (!role || !experience || !topicToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const prompt = questionAnswerPrompt(role, experience, topicToFocus, numberOfQuestions);
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            content: prompt,
        });

        let rawText = response.text;
        
        const cleanedtext = rawText
        // .replace(/^\d+\.\s+/gm, '')
        .replace(/^``` json\s*/, "")
        .replace(/```$/, "")
        .trim(); 

        const data=JSON.parse(cleanedtext);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to generate interview questions',
            error: error.message 
        });
    }
}


const generateConceptExplanation = async (req, res) => {
    try {
         const { question } = req.body;
         if (!question) {
            return res.status(400).json({ message: 'Question is required' });
            }
            const prompt = conceptExplainPrompt(question);

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-lite',
                content: prompt,
            });
        let rawText = response.text;    

        const cleanedText = rawText
        .replace(/^``` json\s*/, "")
        .replace(/```$/, "")
        .trim();

        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to generate concept explanation',
            error: error.message 
        });
    }
}

module.exports = {
    generateInterviewQuestions,
    generateConceptExplanation
};