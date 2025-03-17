import api from "./api";

interface SongDto {
    songId: number;
    userId: number;
    title: string;
    artist: string;
    genre: string;
    filePath: string;
    isPrivate: boolean;
    uploadDate: string;
}
const songInPlaceService = {
getSongsInFolder: async (id: number): Promise<SongDto[]> => {
    try {
        const response = await api.get(`/Folders/songs/${id}`);
        return response.data;
    } catch (error) {
        console.error(`שגיאה בקבלת שירים בתיקייה עם מזהה ${id}:`, error);
        throw error;
    }
  },
  getSongsInPlaylist: async (id: number): Promise<SongDto[]> => {
    try {
        const response = await api.get(`/Playlists/songs/${id}`);
        return response.data;
    } catch (error) {
        console.error(`שגיאה בקבלת שירים ברשימת השמעה עם מזהה ${id}:`, error);
        throw error;
    }
  },
};
export default songInPlaceService;