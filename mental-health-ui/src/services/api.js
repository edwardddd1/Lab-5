import axios from 'axios';

const api = axios.create({
  baseURL: 'http://https://lab-5-65sp.onrender.com/api' 
});

export default api;