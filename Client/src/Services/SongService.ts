import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך
import folderService from './FolderService';

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
    title: string;
    artist: string;
    genre: string;
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
      console.log("in public");
      
      const response = await api.get(`/Songs/public/${name}`);
      console.log(response)
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
     const foldersResponse = await api.get(`/Folders/`);
     let bool = foldersResponse.data.find((f: any) => f.folderName === songUpdate.artist);
     if(!bool)
     {
      bool= await folderService.addFolder({ folderName: songUpdate.artist || 'Unknown Artist' ,parentFolderId:null})
       
     }
     await folderService.addSongToFolder(bool.folderId,id)
    } catch (error) {
      console.error(`שגיאה בעדכון שיר עם מזהה ${id}:`, error);
      throw error;
    }
  },

  updateSongPermission: async (id: number): Promise<void> => {
    try {
      
      await api.put(`/Songs/permission/${id}`);
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

