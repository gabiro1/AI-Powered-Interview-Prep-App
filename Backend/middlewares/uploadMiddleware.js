const multer = require('multer');
const path = require('path');

// Storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File type filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed.'), false);
    }
};

// Export the configured multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 15 }, // 15 MB
    fileFilter: fileFilter
});

module.exports = upload;
