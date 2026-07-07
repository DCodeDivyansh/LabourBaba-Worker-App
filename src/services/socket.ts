import { io } from "socket.io-client";
import Config from "react-native-config";

export const socket = io(Config.API_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// socket.on("connect", () => {
//   console.log("Connected", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected");
// });

// socket.on("connect_error", (err) => {
//   console.log("Connect Error", err.message);
// });