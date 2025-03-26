import api from "./api";
//https://localhost:7260/api/Auth/Login
const authService = {
  login: async (email: string, password: string) => {
    return api.post('/Auth/Login', {
      password: password,
      email: email
    }).then((response) => {

      const token = response.data.token;
      sessionStorage.setItem('token', token);
      return response;
    }).catch((error) => {
      console.error('שגיאה בהתחברות:', error);
      throw error;
    });
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/Auth/register', {
        username: username,
        email: email,
        password: password,
      });

      // שמירת הטוקן (אופציונלי - תלוי אם אתה רוצה שהמשתמש יהיה מחובר מיד לאחר הרישום)
      const token = response.data.token;
      sessionStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      // טיפול בשגיאות
      console.error('שגיאה ברישום:', error);
      throw error;
    }
  },

  logout: () => {
    // מחיקת הטוקן
    sessionStorage.removeItem('token'); // או מחיקה ממקום האחסון שלך
    // ניתן להוסיף פעולות נוספות בעת התנתקות
  },

  getToken: () => {
    // שליפת הטוקן (לשימוש במקומות אחרים באפליקציה)
    return sessionStorage.getItem('token');
  },
};

export default authService;