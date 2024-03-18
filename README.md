# HackAZ2024 - Letter Hunter
https://github.com/alielbekov/HackAZ2024/assets/83210137/0fe95758-062c-418e-81e0-ecb0fc294b1a

## Overview
Letter Hunter is an exciting mobile game that challenges players to find and capture words in real-world surroundings. Developed during the HackAZ2024 hackathon, this game utilizes augmented reality to create an immersive experience.

## Technologies
- **Frontend:** React-Native, with a well-organized structure including components such as Buttons, Modals, Game pages, and more.
- **Backend:** Node.js with Express, leveraging WebSockets for real-time communication and REST-API for service interaction.
- **Database:** None (Could use MongoDB, but that is too much)
- **Others:** HTML, CSS, JavaScript, and native device features like camera integration.

## Features
- Multiplayer functionality where players can join rooms and play with friends.
- Levels with increasing difficulty and complexity.
- Real-time score tracking, leaderboards, and progress updates.

## Getting Started
To set up the game on your local machine for development and testing purposes, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/alielbekov/HackAZ2024.git
```
2. Navigate to the project directory:
```bash
cd HackAZ2024
```
3. Install the necessary packages:
```bash
npm install
```
4. Start the backend server:
```bash
node backend/server.js
```
5. In a new terminal window, navigate to the frontend directory:
```bash
cd frontend
```
6. Install the frontend dependencies:
```bash
npm install
```
8. Start the React Native app using Expo:
```bash
npx expo start
```

Note: Ensure you have Node.js and expo installed on your system to use `npm` commands.

## How to Play
- Launch the app on your device.
- On the landing screen, choose "Start" to play solo or "Join Room" to play with others.
- If joining a room, enter the Room ID provided by the host.
- Once in the game, use your device's camera to find and capture letters in the environment that make up the words shown on your screen.
- Be quick and accurate to score the highest points!

## Contributing
We encourage contributions from the community. To contribute, please follow these steps:

- Fork the repository.
- Create a new branch for your feature (`git checkout -b feature-branch`).
- Make your changes.
- Commit your changes (`git commit -am 'Add some feature'`).
- Push to the branch (`git push origin feature-branch`).
- Create a new Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments
- Kudos to the HackAZ2024 organizers for their support and for setting up such a creative environment.
- A huge thank you to all the participants and contributors who have invested their time and effort into this project.
