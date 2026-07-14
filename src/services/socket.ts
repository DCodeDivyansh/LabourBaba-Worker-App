import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const socket = io('https://api.labourbaba.in', {
  autoConnect: true,
  // ⬅ FIXED: was transports: ['websocket']. Forcing WebSocket-only skips
  // Socket.IO's normal polling-first handshake — if there's any reverse
  // proxy in front (nginx, etc.) that doesn't forward Upgrade/Connection
  // headers, this fails outright. Letting the client fall back
  // automatically is strictly safer on mobile networks.
  timeout: 10000,
});

socket.on('connect', async () => {
  console.log('CONNECTED');
  console.log(socket.id);
  try {
    const workerString = await AsyncStorage.getItem('worker');
    if (workerString) {
      const worker = JSON.parse(workerString);
      socket.emit('join:worker', worker.id);
      console.log('[socket] Rejoined worker room on connect:', worker.id);
    }
  } catch (err) {
    console.log('[socket] Failed to rejoin worker room on connect:', err);
  }
});

socket.on('disconnect', (reason) => {
  console.log('DISCONNECTED', reason);
});

socket.on('connect_error', (err) => {
  console.log('CONNECT ERROR');
  console.log(err.message);
  console.log(err);
});