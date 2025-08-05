require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { generateInterviewQuestions, generateConceptExplanation } = require('./controllers/aiController');
const protect = require("./middlewares/authMiddleware");


const app = express();



// Middleware to handle cors
app.use(cors(
    {
        origin:"*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));

// Connect to the database
connectDB();

// Middleware 
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// routes 
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-question", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explaination", protect, generateConceptExplanation);

// server uploads folder 
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// start server 
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

