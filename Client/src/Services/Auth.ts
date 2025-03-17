import api from "./api";

const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/Auth/Login/', {
        email: email,
        password: password,
      });

      // שמירת הטוקן
      const token = response.data.token;
      localStorage.setItem('token', token); // או כל מקום אחר שבו את שומרת את האסימון

      return response.data; // ניתן להחזיר את כל התגובה או רק את הנתונים הרלוונטיים
    } catch (error) {
      // טיפול בשגיאות
      console.error('שגיאה בהתחברות:', error);
      throw error; // העברת השגיאה הלאה כדי שניתן יהיה לטפל בה בקומפוננטה
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/Auth/register/', {
        username: username,
        email: email,
        password: password,
      });

      // שמירת הטוקן (אופציונלי - תלוי אם אתה רוצה שהמשתמש יהיה מחובר מיד לאחר הרישום)
      const token = response.data.token;
      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      // טיפול בשגיאות
      console.error('שגיאה ברישום:', error);
      throw error;
    }
  },

  logout: () => {
    // מחיקת הטוקן
    localStorage.removeItem('token'); // או מחיקה ממקום האחסון שלך
    // ניתן להוסיף פעולות נוספות בעת התנתקות
  },

  getToken: () => {
    // שליפת הטוקן (לשימוש במקומות אחרים באפליקציה)
    return localStorage.getItem('token');
  },
};

export default authService;