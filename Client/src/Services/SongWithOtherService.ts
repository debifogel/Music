import { Folder } from '@/Models/folder';
import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך



interface PlaylistDto {
  playlistId: number;
  playlistName: string;
}

const songWithOtherService = {
  getFoldersBySongId: async (songId: number): Promise<Folder[]> => {
    try {
      const response = await api.get(`/SongWithOther/folders/${songId}`);
      return response.data;
    } catch (error) {
      console.error(`שגיאה בקבלת תיקיות עבור שיר עם מזהה ${songId}:`, error);
      throw error;
    }
  },

  getPlaylistsBySongId: async (songId: number): Promise<PlaylistDto[]> => {
    try {
      const response = await api.get(`/SongWithOther/playlists/${songId}`);
      return response.data;
    } catch (error) {
      console.error(`שגיאה בקבלת רשימות השמעה עבור שיר עם מזהה ${songId}:`, error);
      throw error;
    }
  },
};

export default songWithOtherService;