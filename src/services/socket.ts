import { io } from "socket.io-client";

export const socket = io("https://api.labourbaba.in", {
  transports: ["polling", "websocket"],
  autoConnect: true,
  timeout: 10000,
});
socket.on("connect", () => {
  console.log("CONNECTED");
  console.log(socket.id);
});

socket.on("disconnect", reason => {
  console.log("DISCONNECTED", reason);
});

socket.on("connect_error", err => {
  console.log("CONNECT ERROR");
  console.log(err.message);
  console.log(err);
});