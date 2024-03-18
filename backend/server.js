const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const multer = require('multer');
const { ocrSpace } = require('ocr-space-api-wrapper');
const fs = require('fs');
const uploadDir = 'uploads/';
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
//const faker = require('faker');

const {generateUsername } = require("unique-username-generator");
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app); // Create HTTP server from Express app
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust according to your security requirements
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;
const publicUrlBase = 'http://localhost:3000/uploads/'


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Rooms structure: Maps room ID to room state
const rooms = new Map();

// User Class - Contains name, color and score (initially 0) of the user.
class User {
    constructor(name, color) {
      this.name = name;
      this.color = color;
      this.score = 0;
    }
  }

// Configure multer for image storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Assuming roomId is available in req.body or as a URL parameter. Adjust as necessary.
        const roomId = req.body.roomId || req.params.roomId;
        if (!roomId) {
            return cb(new Error('Room ID is missing'), false);
        }
        const roomUploadDir = `${uploadDir}${roomId}/`;
        if (!fs.existsSync(roomUploadDir)) {
            fs.mkdirSync(roomUploadDir, { recursive: true });
        }
        cb(null, roomUploadDir);
    },
    filename: function(req, file, cb) {
        // Generate a unique file name as before
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});


const upload = multer({ storage: storage });
const wordBank = ['revolutionary', 'unbelievable', 'conversations', 'international', 'technological', 'sustainability', 'understanding', 'extraordinary', 'collaboration', 'transportation', 'communication', 'entertainment', 'environmental', 'accomplishment', 'configurations', 'archaeological', 'independently', 'misunderstood', 'reconstruction', 'straightforward', 'transformation', 'unconventional', 'visualization', 'accountability', 'characteristic', 'discrimination', 'infrastructure', 'microorganisms', 'philosophical', 'responsibility'];


app.use(express.json({limit: '50mb'})); // Increased limit if you're expecting large images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.post('/image', upload.single('image'), async (req, res) => {
    const { roomId, userId } = req.body;
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
                imagePath = `${uploadDir}${roomId}-${Date.now()}.jpg`;
                fs.writeFileSync(imagePath, base64Data, {encoding: 'base64'});
            } else {
                return res.status(400).json({ error: 'No file uploaded, URI, or Base64 data provided.' });
            }
            // OCR or other processing can go here
            const ocrResult = await ocrSpace(imagePath, { apiKey: process.env.OCR_API_KEY });
            // Process and respond as necessary
            const letters = ocrResult.ParsedResults[0].ParsedText.replace(/[^a-zA-Z]/g, '').toLowerCase().split('');
            const userColor = room.users.get(userId).color; // Get the user's color
            letters.forEach(letter => {
                if (!room.lettersFound.has(letter)) {
                    room.lettersFound.set(letter, userColor); // Associate the letter with the user's color
                }
            });

            const gameStatus = isGameOver(room.lettersFound, room.currentWord);
            
            res.status(200).json({status: 'success', isGameOver: gameStatus});
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        res.status(404).json({ error: 'Room not found' })
    }
});

app.get("/get-found-letters/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    console.log("get-found-letters", roomId);
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        // Convert the Map of letters and colors to an array of objects
        const lettersFoundArray = Array.from(room.lettersFound).map(([letter, color]) => ({
            letter,
            color
        }));
        res.json({ lettersFound: lettersFoundArray });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});



app.get('/get-word/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    console.log("get-word", roomId);
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if (room.currentWord !== "") {
            res.json({ currentWord: room.currentWord });
        } else {
            let word = wordBank[Math.floor(Math.random() * wordBank.length)];
            room.currentWord = word;
            res.json({ currentWord: word });
        }
    }else{
        res.status(404).json({ error: 'Room not found' });
    }
});

app.get("/start", (req, res) => {

    // new user ID every time the game starts
    const userId = uuidv4();
    let roomId = generateAlphanumericId();
    const color = generateRandomColor();
    const new_user = new User(generateUsername(), color);
    const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];   
    rooms.set(roomId, {
        lettersFound: new Map(),
        currentWord: randomWord,
        users: new Map()
    });
    rooms.get(roomId).users.set(userId, new_user);
    console.log(rooms.get(roomId))
    res.json({ roomId, userId });
});

app.get("/join/:roomID", (req, res) => {
    const userId = uuidv4();
    const roomId = req.params.roomID;
    if(rooms.has(roomId)){
        const room = rooms.get(roomId);
        const new_user = new User(generateUsername(), generateRandomColor());
        room.users.set(userId, new_user);
        res.json({ roomId, userId });
    }else{
        res.status(404).json({ error: 'Room not found' });
    }
});

app.get("/get-room-info/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    if(rooms.has(roomId)){
        const room = rooms.get(roomId);
        console.log(room);
        res.json({ room });
    }else{
        res.status(404).json({ error: 'Room not found' });
    }  
 });

// Generate Random Colors
app.get('/get-color/:roomId/:userId', (req, res) => {
    const userId = req.params.userId;
    const roomId = req.params.roomId;
    if(rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if(room.users.has(userId)) {
            const user = room.users.get(userId);
            const color = user.color;
            res.json({ userId, color });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});


async function getImagesForTheRoom(roomId){
    const images = fs.readdirSync(uploadDir).filter(fileName => {
        // Filter files starting with the roomId
        return fileName.startsWith(roomId + '-'); // Assuming a naming convention like 'roomId-filename.ext'
    }).map(fileName => {
        // Generate a URL for each filtered image
        return `${publicUrlBase}${fileName}`;
    });

    return images;

}

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


function generateAlphanumericId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    do {
        id = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            id += chars[randomIndex];
        }
    } while (rooms.has(id));    
    return id;
}

function isGameOver(lettersFound, currentWord){
    let gameStatus = true;
    for (let i = 0; i < currentWord.length; i++) {
        if (!lettersFound.has(currentWord[i])) {
            gameStatus = false;
            break;
        }
    }
    return gameStatus;
}



function generateRandomColor() {
    // Generate a random hue from the color wheel
    const hue = Math.floor(Math.random() * 360);
    
    // Set high saturation and brightness to get vivid colors
    const saturation = 90 + Math.floor(Math.random() * 10); // 90-100%
    const brightness = 90 + Math.floor(Math.random() * 10); // 90-100%
    
    // Convert HSV to RGB (function below)
    const rgb = hsvToRgb(hue, saturation, brightness);
    
    // Convert RGB to hexadecimal format
    const color = `#${componentToHex(rgb.r)}${componentToHex(rgb.g)}${componentToHex(rgb.b)}`;
    return color;
}

// Helper function to convert HSV to RGB
function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    const k = n => (n + h / 60) % 6;
    const f = n => v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1));
    return {
        r: Math.floor(255 * f(5)),
        g: Math.floor(255 * f(3)),
        b: Math.floor(255 * f(1))
    };
}

// Helper function to convert a color component to a hexadecimal string
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}



io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('joinRoom', ({ roomId, userId }) => {
        socket.join(roomId);
        const updatedPlayerNumber = rooms.get(roomId).users.size;
        const users = rooms.get(roomId).users;
        const usersObj = Object.fromEntries(users);
        console.log(usersObj);
        io.to(roomId).emit('updatePlayerNumber', usersObj);
    });

    socket.on('startGame', ({ roomId }) => {
        io.to(roomId).emit('startGame');
    });
    

    socket.on('lettersUpdated', ({ roomId }) => {
        const lettersFound = Array.from(rooms.get(roomId).lettersFound).map(([letter, color]) => ({ letter, color }));
        io.to(roomId).emit('lettersUpdated', lettersFound);
    });
    

    socket.on('updatePlayerNumber', (roomId) => {
        io.to(roomId).emit('updatePlayerNumber', rooms.get(roomId).users.size);
    });

    socket.on('gameOver', async ({ roomId }) => {
        const imagesList = await getImagesForTheRoom(roomId);
        io.to(roomId).emit('gameOver', { imagesList });
    });

    // Handling disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
    
    // More event handlers here
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  