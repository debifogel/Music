import axios from 'axios';

const api = axios.create({
  baseURL: 'https://musicserver-xzkr.onrender.com/api', // שנה לכתובת הבסיס של ה-API שלך
  timeout: 7000, 
    headers: {
        'Content-Type': 'application/json'
    }
});

// הוספת אימות JWT לכל בקשה
api.interceptors.request.use(
  (config) => {
    
    const token = sessionStorage.getItem('token'); // או כל מקום אחר שבו את שומרת את האסימון
    if (token) {
      console.log('config')
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;