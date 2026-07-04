import { io } from "socket.io-client";

export const socket = io("http://192.168.31.201:5000", {
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