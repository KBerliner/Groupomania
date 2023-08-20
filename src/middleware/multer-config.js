// Installing Dependencies

const multer = require('multer');

console.log('Multer middleware has been activated.');

// File Extension Possibilites

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Saving Images

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exporting the image saving function

module.exports = multer({ storage: storage }).single('image');