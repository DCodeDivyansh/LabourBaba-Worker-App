import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.31.201:5000", // change port if needed
  headers: {
    "Content-Type": "application/json",
  },
});