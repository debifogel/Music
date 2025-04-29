export interface User {
    userId: number;
    username: string;
    email: string;
    isAdmin: boolean;
    isBlocked: boolean;
    registrationDate: string; // או Date, בהתאם לאופן הטיפול בתאריכים
    lastLogin: string; // או Date, בהתאם לאופן הטיפול בתאריכים
  }