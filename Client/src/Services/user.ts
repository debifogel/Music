import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך

interface User {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  registrationDate: string; // או Date, בהתאם לאופן הטיפול בתאריכים
  lastLogin: string; // או Date, בהתאם לאופן הטיפול בתאריכים
}

interface UserDto {
  username: string;
  email: string;
  // לא כולל סיסמה מטעמי אבטחה
}

const userService = {
  
  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`/Users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`שגיאה בקבלת משתמש עם מזהה ${id}:`, error);
      throw error;
    }
  },

  updateUser: async ( userDto: UserDto): Promise<void> => {
    try {
      await api.put(`/Users/${0}`, userDto);
    } catch (error) {
      console.error(`שגיאה בעדכון משתמש עם מזהה :`, error);
      throw error;
    }
  },
};

export default userService;