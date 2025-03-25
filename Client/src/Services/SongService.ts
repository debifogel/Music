import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך

interface Song {
  songId: number;
  userId: number;
  title: string;
  artist: string;
  genre: string;
  filePath: string;
  isPrivate: boolean;
  uploadDate: string; // או Date, בהתאם לאופן הטיפול בתאריכים
}

interface SongDto {
  title: string;
  artist: string;
  genre: string;
  filePath?: string;
  isPrivate: boolean;
}

interface SongUpdate {
    title?: string;
    artist?: string;
    genre?: string;
    filePath?: string;
}

const songService = {
  getAllSongs: async (): Promise<Song[]> => {
    try {
      const response = await api.get('/Songs');
      return response.data;
    } catch (error) {
      console.error('שגיאה בקבלת כל השירים:', error);
      throw error;
    }
  },

  getAllPublicSongs: async (name: string): Promise<Song[]> => {
    try {
      const response = await api.get(`/Songs/public/${name}`);
      return response.data;
    } catch (error) {
      console.error('שגיאה בקבלת שירים ציבוריים:', error);
      throw error;
    }
  },

  getSongById: async (id: number): Promise<Song> => {
    try {
      const response = await api.get(`/Songs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`שגיאה בקבלת שיר עם מזהה ${id}:`, error);
      throw error;
    }
  },

  addSong: async (songDto: SongDto): Promise<Song> => {
    try {
      const response = await api.post('/Songs', songDto);
      return response.data;
    } catch (error) {
      console.error('שגיאה בהוספת שיר:', error);
      throw error;
    }
  },

  updateSong: async (id: number, songUpdate: SongUpdate): Promise<void> => {
    try {
      await api.put(`/Songs/${id}`, songUpdate);
    } catch (error) {
      console.error(`שגיאה בעדכון שיר עם מזהה ${id}:`, error);
      throw error;
    }
  },

  updateSongPermission: async (id: number, isPrivate: boolean): Promise<void> => {
    try {
      await api.put(`/Songs/permission/${id}`, isPrivate);
    } catch (error) {
      console.error(`שגיאה בעדכון הרשאה לשיר עם מזהה ${id}:`, error);
      throw error;
    }
  },

  deleteSong: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Songs/${id}`);
    } catch (error) {
      console.error(`שגיאה במחיקת שיר עם מזהה ${id}:`, error);
      throw error;
    }
  },
};

export default songService;