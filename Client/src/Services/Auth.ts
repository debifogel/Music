import { jwtDecode, JwtPayload } from "jwt-decode";
import api from "./api";

interface CustomJwtPayload extends JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
}

const authService = {
  login: async (email: string, password: string) => {
    return api.post("/Auth/Login", { email, password })
      .then((response) => {
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        return response;
      })
      .catch((error) => {
        console.error("שגיאה בהתחברות:", error);
        throw error;
      });
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post("/Auth/register", { username, email, password });

      // Save token (if needed)
      const token = response.data.token;
      sessionStorage.setItem("token", token);

      return response.data;
    } catch (error) {
      console.error("שגיאה ברישום:", error);
      throw error;
    }
  },

  logout: () => {
    // מחיקת הטוקן
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("insite")
  },
  getUserNameFromToken: (): string | null => {
    try {
      const token = authService.getToken();
      if (!token) return null;
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? null;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  },

  getEmailFromToken: (): string | null => {
    try {
      const token = authService.getToken();
      if (!token) return null;
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? null;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  },

  getRoleFromToken: (): string | null => {
    try {
      const token = authService.getToken();
      if (!token) return null;
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  },

  getToken: (): string | null => {
    return sessionStorage.getItem("token");
  },
};

export default authService;
