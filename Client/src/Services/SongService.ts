import { Song } from '@/Models/song';
import api from './api'; // ייבוא מופע ה-Axios המוגדר שלך
import folderService from './FolderService';
import S3Service from './awsService';
import axios from 'axios';

interface SongDto {
  title: string;
  artist: string;
  genre: string;
  filePath: string;
  isPrivate: boolean;
}
const aiUrl="https://musicai-tq2n.onrender.com/"//TODO change to the real url
interface SongUpdate {
    title: string;
    artist: string;
    genre: string;
}
const extractUserIdFromToken=()=>
{
  const token = sessionStorage.getItem('token'); // Retrieve token from session storage
        if (!token) {
          throw new Error("Token not found in session storage");
        }
        const payload = JSON.parse(atob(token.split('.')[1])); 
        
          return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
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
        const songId = await api.post('/Songs/',

            {...songDetails,
            }
        );
        const filepath =S3Service.generatePresignedUrl(songDetails.filePath);
       

       
        axios.post(`${aiUrl}process-audio/`, {
          user_id: extractUserIdFromToken(),
          song_id: songId.data,
          Audio: filepath,
        })
        .catch((error) => {
          // Errors will be caught here but the request does not wait for a result
          console.error("Error sending audio:", error);
        });
        return songId.data; // Ensure songId is properly declared and used

  } catch (error) {
    console.error("Error:", error);
    throw error; // Ensure the error is propagated
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
      //TODO add a delete from pinecone
      

        axios.delete(`${aiUrl}delete-song/`, {      
          data: {
            user_id: extractUserIdFromToken(),
            song_id: id,
          },
        });
      
    } catch (error) {
      console.error(`שגיאה במחיקת שיר עם מזהה ${id}:`, error);
      throw error;
    }
    
  },
  searchAndFetchSongs: async ( query: string): Promise<Song[]> => {
    try {
      const token = sessionStorage.getItem('token'); // Retrieve token from session storage
      if (!token) {
        throw new Error("Token not found in session storage");
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]; // Extract userId from token payload
      // Send the search query to the first server
      const searchResponse = await axios.get(`${aiUrl}search-similar/`, {
        params: { user_id: userId, query: query },
      });
      const matchedIds: number[] = searchResponse.data;
      if (!matchedIds || matchedIds.length === 0) {
        console.warn('No matches found for the query.');
        return [];
      }

      // Send the list of IDs to the second server
      const songsResponse = await api.get('/Songs/ids', {
        params: { ids: matchedIds },
      });

      return songsResponse.data;
    } catch (error) {
      console.error('Error in searching and fetching songs:', error);
      throw error;
    }
  },
};

export default songService;

