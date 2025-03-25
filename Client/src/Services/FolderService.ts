import { Folder } from 'lucide-react';
import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך

 interface Folder {
  folderId: number;
  userId: number;
  folderName: string;
  parentFolderId: number | null;
}

interface FolderDto {
  folderName: string;
  parentFolderId: number | null;
}



const folderService = {
  getAllFolders: async (): Promise<Folder[]> => {
    try {
      const response = await api.get('/Folders');
      return response.data;
    } catch (error) {
      console.error('שגיאה בקבלת כל התיקיות:', error);
      throw error;
    }
  },

  getFolderById: async (id: number): Promise<Folder> => {
    try {
      const response = await api.get(`/Folders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`שגיאה בקבלת תיקייה עם מזהה ${id}:`, error);
      throw error;
    }
  },

  getFoldersByParentId: async (id: number): Promise<Folder[]> => {
    try {
        const response = await api.get(`/Folders/parent/${id}`);
        return response.data;
    } catch (error) {
        console.error(`שגיאה בקבלת תיקיות עם מזהה אב ${id}:`, error);
        throw error;
    }
  },

  addFolder: async (folderDto: FolderDto): Promise<Folder> => {
    try {
      const response = await api.post('/Folders', folderDto);
      return response.data;
    } catch (error) {
      console.error('שגיאה בהוספת תיקייה:', error);
      throw error;
    }
  },

  renameFolder: async (id: number, folderName: string): Promise<void> => {
    try {
      await api.put(`/Folders/${id}?folderName=${encodeURIComponent(folderName)}`);
    } catch (error) {
      console.error(`שגיאה בשינוי שם תיקייה עם מזהה ${id}:`, error);
      throw error;
    }
  },

  changeParentFolder: async (id: number, parentFolderId: number): Promise<void> => {
    try {
      await api.put(`/Folders/parent/${id}?parentFolderId=${parentFolderId}`);
    } catch (error) {
      console.error(`שגיאה בשינוי תיקיית אב לתיקייה עם מזהה ${id}:`, error);
      throw error;
    }
  },

  addSongToFolder: async (folderId: number, songId: number): Promise<void> => {
    try {
      await api.put(`/Folders/song/${folderId}/${songId}`);
    } catch (error) {
      console.error(`שגיאה בהוספת שיר עם מזהה ${songId} לתיקייה עם מזהה ${folderId}:`, error);
      throw error;
    }
  },

  removeSongFromFolder: async (folderId: number, songId: number): Promise<void> => {
    try {
      await api.delete(`/Folders/song/${folderId}/${songId}`);
    } catch (error) {
      console.error(`שגיאה בהסרת שיר עם מזהה ${songId} מתיקייה עם מזהה ${folderId}:`, error);
      throw error;
    }
  },

  deleteFolder: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Folders/${id}`);
    } catch (error) {
      console.error(`שגיאה במחיקת תיקייה עם מזהה ${id}:`, error);
      throw error;
    }
  }

  
};

export default folderService;