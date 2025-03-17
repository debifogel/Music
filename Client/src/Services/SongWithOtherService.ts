import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך

interface FolderDto {
  folderId: number;
  folderName: string;
  parentFolderId: number | null;
}

interface PlaylistDto {
  playlistId: number;
  playlistName: string;
}

const songWithOtherService = {
  getFoldersBySongId: async (songId: number): Promise<FolderDto[]> => {
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