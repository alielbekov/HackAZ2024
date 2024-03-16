const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const multer = require('multer');
const {ocrSpace} = require('ocr-space-api-wrapper');
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = 3000;

// Configure multer for image storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });

const lettersFound = new Set();
let currentWord = "";
const wordBank = [
    "aliens", "asteroids", "astronaut", "blackhole", "comet", "constellation", "cosmos", "earth", "eclipse", "galaxy", "gravity", "jupiter", "mars", "mercury", "meteor", "meteorite", "moon", "neptune", "orbit", "planet", "pluto", "rocket", "satellite", "saturn", "shuttle", "solar", "space", "spaceship", "star", "sun", "telescope", "universe", "uranus", "venus", "zodiac"
 ];

app.use(express.json());
app.use(express.static('public'));

app.post('/image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    try {
        const ocrResult = await ocrSpace(req.file.path, { apiKey: process.env.OCR_API_KEY });
        // Extract letters from OCR result and add to lettersFound set
        const letters = ocrResult.ParsedResults[0].ParsedText.replace(/[^a-zA-Z]/g, '').toLowerCase();
        Array.from(letters).forEach(letter => lettersFound.add(letter));

        res.json({lettersFound: Array.from(lettersFound)});
    } catch (error) {
        console.error('OCR Error:', error);
        if (error.statusCode === 500) {
            res.status(500).json({ error: 'OCR service error.' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.get('/get-word', (req, res) => {
    if(currentWord !== ""){
        res.json({ currentWord });
    }else{
        let word = wordBank[Math.floor(Math.random() * wordBank.length)];
        currentWord = word;
        res.json({ currentWord: word });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
