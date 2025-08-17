import OpenAI from "openai";
import { conceptExplainPrompt, questionAnswerPrompt } from "../utils/prompts.js";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Utility to safely parse JSON
const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON parse failed:", err.message);
    return { raw: text }; // fallback
  }
};

// Generate interview questions
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions) +
      "\nReturn strictly valid JSON array, no extra text.";

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const rawText = response.choices[0].message.content.trim();

    const data = safeParseJSON(rawText);

    res.status(200).json(data);
  } catch (error) {
    console.error("AI Controller Error:", error.message);
    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};

// Generate concept explanation
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question) +
      "\nReturn strictly valid JSON object, no extra text.";

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const rawText = response.choices[0].message.content.trim();

    const data = safeParseJSON(rawText);
    
    console.log("Explanation Response Data:", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("AI Controller Error:", error.message);
    res.status(500).json({
      message: "Failed to generate concept explanation",
      error: error.message,
    });
  }
};
