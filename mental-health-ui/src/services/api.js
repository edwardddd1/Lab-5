// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://lab-5-65sp.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, 
});

export default api;