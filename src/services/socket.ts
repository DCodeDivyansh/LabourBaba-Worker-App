import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const socket = io('https://api.labourbaba.in', {
  autoConnect: true,
  transports: ['websocket'],
});

// ⬅ NEW: whenever the socket (re)connects — whether from this toggle, an
// automatic reconnect after a dropped connection, or app relaunch — rejoin
// the worker's room using whatever worker is currently cached. This is the
// real fix for "online in the DB but silently stopped receiving jobs after
// any connection blip."
socket.on('connect', async () => {
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