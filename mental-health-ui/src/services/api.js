// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://lab-5-65sp.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, 
});

export default api;