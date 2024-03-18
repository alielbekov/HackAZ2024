// socketService.js
import io from "socket.io-client";

// Replace this URL with your server's URL
const SOCKET_URL = "http://137.184.74.25:3000";
//const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL, {
  // Enables auto reconnection
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket'],
});

export default socket;
