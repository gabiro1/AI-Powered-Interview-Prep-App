const express = require("express");
const router = express.Router();

// Middleware
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Controllers
const { loginUser, registerUser, getUserProfile } = require("../controllers/authController");

// Routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", protect, getUserProfile);

// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

module.exports = router;
