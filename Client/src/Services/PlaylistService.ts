import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך

interface Playlist {
  playlistId: number;
  userId: number;
  playlistName: string;
  creationDate: string; // או Date, בהתאם לאופן הטיפול בתאריכים
}



const playlistService = {
  getAllPlaylists: async (): Promise<Playlist[]> => {
    try {
      const response = await api.get('/Playlists');
      return response.data;
    } catch (error) {
      console.error('שגיאה בקבלת כל רשימות ההשמעה:', error);
      throw error;
    }
  },

  getPlaylistById: async (id: number): Promise<Playlist> => {
    try {
      const response = await api.get(`/Playlists/${id}`);
      return response.data;
    } catch (error) {
      console.error(`שגיאה בקבלת רשימת השמעה עם מזהה ${id}:`, error);
      throw error;
    }
  },

  addPlaylist: async (playlistName: string): Promise<Playlist> => {
    try {
      const response = await api.post('/Playlists', null, {
        params: { playlistname: playlistName },
      });
      console.log("in add playlist")
      return response.data;
    } catch (error) {
      console.error('שגיאה בהוספת רשימת השמעה:', error);
      throw error;
    }
  },

  renamePlaylist: async (id: number, playlistName: string): Promise<void> => {
    try {
      await api.put(`/Playlists/${id}?playlistName=${encodeURIComponent(playlistName)}`);
    } catch (error) {
      console.error(`שגיאה בשינוי שם רשימת השמעה עם מזהה ${id}:`, error);
      throw error;
    }
  },

  addSongToPlaylist: async (playlistId: number, songId: number): Promise<void> => {
    try {
      await api.put(`/Playlists/song/${playlistId}/${songId}`);
    } catch (error) {
      console.error(`שגיאה בהוספת שיר עם מזהה ${songId} לרשימת השמעה עם מזהה ${playlistId}:`, error);
      throw error;
    }
  },

  removeSongFromPlaylist: async (playlistId: number, songId: number): Promise<void> => {
    try {
      await api.delete(`/Playlists/song/${playlistId}/${songId}`);
    } catch (error) {
      console.error(`שגיאה בהסרת שיר עם מזהה ${songId} מרשימת השמעה עם מזהה ${playlistId}:`, error);
      throw error;
    }
  },

  deletePlaylist: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Playlists/${id}`);
    } catch (error) {
      console.error(`שגיאה במחיקת רשימת השמעה עם מזהה ${id}:`, error);
      throw error;
    }
  },

  
};

export default playlistService;