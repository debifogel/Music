import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // שנה לכתובת הבסיס של ה-API שלך
  headers: {
    'Content-Type': 'application/json',
  },
});

// הוספת אימות JWT לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // או כל מקום אחר שבו את שומרת את האסימון
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;