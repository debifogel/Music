import S3Service from "@/Services/awsService";
import songService from "@/Services/SongService";
import playlistService from "@/Services/PlaylistService";
import { useEffect, useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import OptionsMenu from "./OPtionMenu";
import folderService from "@/Services/FolderService";
import { useNavigate } from "react-router-dom";

interface Opt {
    id: number;
    title: string;
    func: () => void;
    child?: Opt[];
}

interface Song {
    songId: number;
    title: string;
    artist: string;
    filePath: string;
    genre:string;
    isPrivate:boolean

}

const OptionSongs = ({ song, inPlay }: { song: Song; inPlay: number}) => {
    const [playlists, setPlaylists] = useState<Opt[]>([]);
    const [edit, setEdit] = useState(false);
    const [editedSong, setEditedSong] = useState({ title: song.title, artist: song.artist,genre:song.genre });
    const route=useNavigate()
 console.log(song)
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await playlistService.getAllPlaylists();
                const formattedPlaylists = res.map((p) => ({
                    id: p.playlistId ,
                    title: p.playlistName,
                    func: () => handleAddToPlaylist(p.playlistId),
                }));
                setPlaylists(formattedPlaylists);
            } catch (error) {
                console.error("שגיאה בטעינת רשימות השמעה", error);
            }
        };

        fetchPlaylists();
    }, []);

    const handleEdit = () => {
        setEdit(true);
    };

    const handleDelete = async () => {
        try {
            await S3Service.deleteFile(song.filePath);
            console.log("delete file from s3")
            await songService.deleteSong(song.songId);
            await folderService.removeEmptyFolder()          

        } catch (error) {
            console.error("שגיאה במחיקת השיר", error);
        }
        route("/songs/all", { replace: true })
    };

    const handleAddToPlaylist = (id: number) => {
        playlistService.addSongToPlaylist(id, song.songId);
        route("/songs/all", { replace: true })
    };

    const handleRemoveFromPlaylist = () => {
        playlistService.removeSongFromPlaylist(inPlay, song.songId);
        route("/songs/all", { replace: true })

    };

    const handleSubmitEdit = async () => {
        try {
            await songService.updateSong(song.songId, editedSong); 
            await folderService.removeEmptyFolder()          
            setEdit(false);
        } catch (error) {
            console.error("שגיאה בעדכון השיר", error);
            setEdit(false);

        }
        route("/songs/all", { replace: true })
        window.location.reload();
    };
    const handlePermission=async()=>{
        try {
          await songService.updateSongPermission(song.songId)
        }
        catch (error) {
            console.error("שגיאה בעדכון השיר", error);

        }
        route("/songs/all", { replace: true })
    }

    return (
        <>
            <OptionsMenu
                options={[
                    { id: 1, title: "ערוך", func: handleEdit },
                    { id: 2, title: "מחק", func: handleDelete },
                    { id: 3, title: "הוסף", func: () => {}, child: playlists },
                    { id: 4, title:song.isPrivate? "שנה לציבורי":"שנה לפרטי", func: handlePermission},
                    ...(inPlay !== 0 ? [{ id: 4, title: "הסר", func: handleRemoveFromPlaylist }] : []),
                ]}
            />

            {/* דיאלוג עריכת שיר */}
            <Dialog open={edit} onClose={() => setEdit(false)}>
                <DialogTitle>עריכת שיר</DialogTitle>
                <DialogContent>
                    <TextField
                        label="שם השיר"
                        fullWidth
                        margin="dense"
                        value={editedSong.title}
                        onChange={(e) => setEditedSong({ ...editedSong, title: e.target.value })}
                    />
                    <TextField
                        label="שם האמן"
                        fullWidth
                        margin="dense"
                        value={editedSong.artist}
                        onChange={(e) => setEditedSong({ ...editedSong, artist: e.target.value })}
                    />
                    <TextField
                        label="גנר"
                        fullWidth
                        margin="dense"
                        value={editedSong.genre}
                        onChange={(e) => setEditedSong({ ...editedSong, genre: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEdit(false)} color="secondary">
                        ביטול
                    </Button>
                    <Button onClick={handleSubmitEdit} color="primary">
                        שמירה
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OptionSongs;
