import NameForm from "@/components/NameForm";
import OptionsMenu from "@/components/OPtionMenu";
import playlistService from "@/Services/PlaylistService";
import { Button, CircularProgress, Grid2 as Grid, Typography, Paper } from "@mui/material";
import { Folder, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

interface Playlist {
  playlistId: number;
  userId: number;
  playlistName: string;
  creationDate: string; 
}

const PlayLists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [addPlay, setAddPlay] = useState(false);
  const [renamePlay, setRenamePlay] = useState(false);
  const [currentPlay, setCurrentPlay] = useState<number | null>(null);
  const [playName, setPlayName] = useState("");
const [keyLOad,setKeyLOad]=useState(0)
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const fetchedPlaylists: Playlist[] = await playlistService.getAllPlaylists();
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      console.error("שגיאה בטעינת רשימות ההשמעה:", error);
    }
    setLoading(false);
  };

  const handleAdd = async (name: string) => {
    setAddPlay(false);
    try {
      await playlistService.addPlaylist(name);
      fetchPlaylists(); // עדכון הרשימה לאחר ההוספה
    } catch (error) {
      console.error("שגיאה בהוספת רשימת ההשמעה", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await playlistService.deletePlaylist(id);
      setPlaylists(playlists.filter((p) => p.playlistId !== id)); // עדכון מיידי של הסטייט
    } catch (error) {
      console.error("שגיאה במחיקת רשימת ההשמעה", error);
    }
  };

  const handleUpdate = async (name: string, id?: number) => {
    setRenamePlay(false);
    if (!id) return;
    try {
      await playlistService.renamePlaylist(id, name);
      setPlaylists(
        playlists.map((p) =>
          p.playlistId === id ? { ...p, playlistName: name } : p
        )
      ); // עדכון מיידי של הסטייט
    } catch (error) {
      console.error("שגיאה בעדכון רשימת ההשמעה", error);
    }
    setKeyLOad(prev=>prev+1)
   console.log(keyLOad+"render in the playlists")
  };

  const rename = (id: number, name: string) => {
    setPlayName(name);
    setRenamePlay(true);
    setCurrentPlay(id);
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;

  return (
    <>
      <Button
        onClick={() => setAddPlay(true)}
        variant="contained"
        color="primary"
        startIcon={<Plus />}
        sx={{ position: "fixed", top: "30px", right: "20px", zIndex: 1000 }}
      >
        הוספת רשימת השמעה
      </Button>

      {addPlay && <NameForm name={""} onClose={handleAdd} />}
      {renamePlay && currentPlay !== null && (
        <NameForm name={playName} id={currentPlay} onClose={handleUpdate} />
      )}

      <Grid container spacing={3} sx={{position:"fixed",top:"100px",left:"300px", marginTop: "80px", justifyContent: "center", width:"60%"}}>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Grid  size={4}  key={playlist.playlistId}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 3,
                  minHeight: "150px",
                  minWidth: "120px",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 5 },
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Link to={`songs/playlist/${playlist.playlistId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Folder size={40} color="blue" />
                  <Typography variant="h6" sx={{}}>{playlist.playlistName}</Typography>
                </Link>
                <OptionsMenu
                  options={[
                    { id: 1, title: "מחק", func: () => handleDelete(playlist.playlistId) },
                    { id: 2, title: "ערוך", func: () => rename(playlist.playlistId, playlist.playlistName) },
                  ]}
                />
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ marginTop: 5, color: "gray" }}>
            אין רשימות השמעה זמינות
          </Typography>
        )}
      </Grid>

      <Outlet />
    </>
  );
};

export default PlayLists;



