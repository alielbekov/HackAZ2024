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
const faker = require('faker');
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
const wordBank = [
    "abcdefghijklmnopqrstuvwxyz"
 ];



app.use(express.json({limit: '50mb'})); // Increased limit if you're expecting large images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
                imagePath = `${uploadDir}${roomId}-${Date.now()}.jpg`;
                console.log('Image path:', imagePath);
                fs.writeFileSync(imagePath, base64Data, {encoding: 'base64'});
            } else {
                return res.status(400).json({ error: 'No file uploaded, URI, or Base64 data provided.' });
            }
            // OCR or other processing can go here
            console.log('Image path:', imagePath);
            const ocrResult = await ocrSpace(imagePath, { apiKey: process.env.OCR_API_KEY });
            // Process and respond as necessary
            // add new letter to lettersFound and send it
            const letters = ocrResult.ParsedResults[0].ParsedText.replace(/[^a-zA-Z]/g, '').toLowerCase().split('');
            letters.forEach(letter => room.lettersFound.add(letter));

            const gameStatus  = isGameOver(room.lettersFound, room.currentWord);
            
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
        res.json({ lettersFound: Array.from(room.lettersFound) });
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
    const new_user = new User(faker.name.findName(), color);
    rooms.set(roomId, {
        lettersFound: new Set(),
        currentWord: "abcdefghijklmnopqrstuvwxyz",
        users: new Map()
    });
    rooms.get(roomId).users.set(userId, new_user);
    res.json({ roomId, userId });
});

app.get("/join/:roomID", (req, res) => {
    const userId = uuidv4();
    const roomId = req.params.roomID;
    if(rooms.has(roomId)){
        const room = rooms.get(roomId);
        const new_user = new User(faker.name.findName(), color);
        room.users.set(userId, new_user);
        res.json({ roomId, userId });
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
    const r = Math.floor(Math.random() * 128 + 127).toString(16);
    const g = Math.floor(Math.random() * 128 + 127).toString(16);
    const b = Math.floor(Math.random() * 128 + 127).toString(16);
    return `#${r}${g}${b}`;
}

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    // Join a specific room
    socket.on('joinRoom', ({ roomId, userId }) => {
        console.log(`User ${userId} joined room ${roomId}`);
        // inform all the users
        //get all the userIDs in the room

        io.to(roomId).emit('newPlayer', userId);
        socket.join(roomId);

    });
    socket.on('lettersUpdated', ({ roomId }) => {
        console.log(`lettersUpdated ${roomId}`);
    
        io.to(roomId).emit('lettersUpdated', Array.from(rooms.get(roomId).lettersFound));
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
  