import { io } from "socket.io-client";

export const socket = io("http://192.168.31.201:5000", {
  autoConnect: false,
  transports: ["websocket"],
});