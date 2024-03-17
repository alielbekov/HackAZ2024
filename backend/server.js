const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const multer = require('multer');
const { ocrSpace } = require('ocr-space-api-wrapper');
const fs = require('fs');
const uploadDir = 'uploads/';
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Rooms structure: Maps room ID to room state
const rooms = new Map();
const lettersFound = new Set();


// Configure multer for image storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir); // Ensure this folder exists
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });

let currentWord = "";
const wordBank = [
    "abcdefghijklmnopqrstuvwxyz"
 ];



app.use(express.json({limit: '50mb'})); // Increased limit if you're expecting large images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(cors());

app.post('/image', upload.single('image'), async (req, res) => {
    const {roomId, userId} = req.body;
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if (!room.users.has(userId)) {
            return res.status(403).json({ error: 'User not in room' });
        }
        try {
            let imagePath;
            if (req.file) {
                imagePath = req.file.path;
            } else if (req.body.imageBase64) {
                // Decode Base64 image
                const base64Data = req.body.imageBase64.split(';base64,').pop();
                imagePath = `${uploadDir}image-${Date.now()}.jpg`;
                fs.writeFileSync(imagePath, base64Data, {encoding: 'base64'});
            } else {
                return res.status(400).json({ error: 'No file uploaded, URI, or Base64 data provided.' });
            }
            // OCR or other processing can go here
            console.log('Image path:', imagePath);
            const ocrResult = await ocrSpace(imagePath, { apiKey: process.env.OCR_API_KEY });
            // Process and respond as necessary
            // add new letter to lettersFound and send it
            const letters = ocrResult.ParsedResults[0].ParsedText.split('');
            letters.forEach(letter => room.lettersFound.add(letter));

            // TODO: need to setup socket.io to send the letters to the clients in the room
            res.json({ lettersFound: Array.from(room.lettersFound)});
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        res.status(404).json({ error: 'Room not found' })
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

app.get("/start", (req, res) => {

    // new user ID every time the game starts
    const userId = uuidv4();
    const roomId = uuidv4();
    rooms.set(roomId, {
        lettersFound: new Set(),
        currentWord: "abcdefghijklmnopqrstuvwxyz",
        users: new Set([userId]) 
    });
    res.json({ roomId, userId });
});

app.get("/join/:roomID", (req, res) => {
    const userId = uuidv4();
    const roomId = req.params.roomID;
    if(rooms.has(roomId)){
        const room = rooms.get(roomId);
        room.users.add(userId);
        res.json({ roomId, userId });
    }else{
        res.status(404).json({ error: 'Room not found' });
    }
});


// Create a new room
app.post('/create-room', (req, res) => {
    const roomId = generateRoomId();
    rooms.set(roomId, { 
        lettersFound: new Set(), 
        currentWord: "", 
        currentSentence: "", 
        users: new Set() // Track users in the room
    });
    res.json({ roomId });
});



// Leave a room
app.post('/leave-room', (req, res) => {
    const { roomId, userId } = req.body;
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.users.delete(userId); // Remove user from the room
        // Consider deleting room if empty
        if (room.users.size === 0) {
            rooms.delete(roomId);
        }
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});


function generateRoomId(){
    let roomId = Math.floor(Math.random() * 10000);
    while(rooms.has(roomId)){
        roomId = Math.floor(Math.random() * 10000);
    }
    rooms.add(roomId);
    return roomId;  
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
