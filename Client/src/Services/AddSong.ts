import { Folder } from '@/Models/folder';
import folderService from './FolderService';
import songService from './SongService';

//the func will get songDto upload to aws with the other service
//get the path of the server and  call to add song (in the other service)
//check if the artist folder exist if not create it
//put the song in the match folder
interface SongDto {
    filePath?: string;
    title: string;
    artist: string;
    genre: string;
    isPrivate: boolean;
}


async function addSong(songDto: SongDto): Promise<void> {
    let folder:Folder|null=null;   
    // Notify the other service to add the song
    const songdata=await songService.addSong(songDto);
 // Check if artist folder exists in 
    try {
        const data= await folderService.getAllFolders();
        folder = data.find((f) => f.folderName === songDto.artist)||null;
    } catch (error) {
        
            console.log(error)
    }
    
    if(folder==null)
    {
        try {
            folder= await folderService.addFolder({folderName:songDto.artist,parentFolderId:null})
        } catch (error) {
            console.log(error)
        }
    }
    //add the song to the folder
    try {
        if (folder) {
            console.log("Folder found:", folder);
            console.log("Adding song to folder:", songdata);
            await folderService.addSongToFolder(folder.folderId, songdata);
        } else {
            console.error("Folder is null. Cannot add song to folder.");
        }
    } catch (error) {
        console.log(error)
    }
}
export default addSong