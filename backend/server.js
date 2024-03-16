const express = require('express');
const app = express();
const PORT = 3000;
//const lettersFound={a:0, b:0, c:0, d:0, e:0, f:0, g:0, h:0, i:0, j:0, k:0, l:0, m:0, n:0, o:0, p:0, q:0, r:0, s:0, t:0, u:0, v:0, w:0, x:0, y:0, z:0};
const lettersFound = Set();
const currentWord = ""
const wordBank = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "imbe", "jackfruit", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yellow", "zucchini"];

// Middleware to parse JSON bodies
app.use(express.json());


// POST endpoint for '/image' to receive an image and respond with found letters
app.post('/image', async (req, res) => {
    // Logic for saving the image and parsing it would go here
    // For now, we will just simulate a response
    let imagePath;// get it from the request
    let isHandWritten = await checkIfHandWritten(imagePath);
    if(isHandWritten){
        res.json({error: "Image is not handwritten", lettersFound:lettersFound});
    }
    else{
        let letters = getLettersFromImage(imagePath);
        for(let i = 0; i < letters.length; i++){
            lettersFound.add(letters[i]);
        }
        res.json({lettersFound:lettersFound});
    }
});

// GET endpoint for '/get-word' to send a word to the client
app.get('/get-word', (req, res) => {
    // Logic to choose and send a word or the current word would go here
    // For now, we will just simulate sending a word
    if(currentWord !== ""){
        res.json({ currentWord:currentWord });
    }else{
        let word = wordBank[Math.floor(Math.random() * wordBank.length)];
        currentWord = word;
        res.json({ currentWord:word });
    }
    
});

function getLettersFromImage(imagePath){
    
}

async function checkIfHandWritten(imagePath){
    //Logic to check if the image is handwritten
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
