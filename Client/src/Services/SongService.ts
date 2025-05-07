import { Song } from '@/Models/song';
import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך
import folderService from './FolderService';
import S3Service from './awsService';
import axios from 'axios';

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

  addSong: async (songDetails: SongDto): Promise<any> => {
    try {
        // שליחת הבקשה
        const songId= await api.post('/Songs/',

            {...songDetails,
            }
        );
        const filepath = songDetails.filePath ? S3Service.generatePresignedUrl(songDetails.filePath) : '';
        const token = sessionStorage.getItem('token'); // Retrieve token from session storage
        if (!token) {
          throw new Error("Token not found in session storage");
        }

        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        const userId = payload.userId; // Extract userId from token payload

        axios.post("http://127.0.0.1:8080/process-audio/", {
          user_id: userId,
          song_id: songId,
          Audio: filepath,
        })
        .catch((error) => {
          // Errors will be caught here but the request does not wait for a result
          console.error("Error sending audio:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
    // שולח לשרת שלך את transcription_id ופרטי השיר
   
   
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

