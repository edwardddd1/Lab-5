// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://lab-5-1-9no2.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, 
});

export default api;