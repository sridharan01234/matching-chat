import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  autoConnect: false,
  transports: ['websocket'],
  auth: {
    userId: null // Will be set when user logs in
  }
});

// Handle authentication errors
socket.on('connect_error', (error) => {
  if (error.message === 'Authentication failed') {
    console.error('Socket authentication failed');
    socket.disconnect();
  }
});

export default socket;
