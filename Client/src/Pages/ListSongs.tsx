import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, CircularProgress, Typography, Paper, Box, Divider } from "@mui/material";
import songService from "../Services/SongService";
import songInPlaceService from "@/Services/SongInPlaceService";
import { useParams } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import SongOptionsMenu from "@/components/OptionSongs";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

interface Song {
  songId: number;
  title: string;
  artist: string;
  filePath: string;
}

const ListSongs = () => {
  const { filterType, filterValue } = useParams(); // קבלת פרמטרים מה-URL
  const [songs, setSongs] = useState<Song[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogin, setLogin] = useState(true);


  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        let fetchedSongs: Song[] = [];

        switch (filterType) {
          case "folder":
            fetchedSongs = await songInPlaceService.getSongsInFolder(Number(filterValue));
            break;
          case "playlist":  
            fetchedSongs = await songInPlaceService.getSongsInPlaylist(Number(filterValue));
            console.log("in playlist");
            break;
          case "name":
            fetchedSongs = await songService.getAllPublicSongs(filterValue || "");
            setLogin ( false);
            break;
          case "all":
            fetchedSongs = await songService.getAllSongs();
            break;
          default:
            console.error("סוג חיפוש לא תקין");
            return;
        }

        setSongs(fetchedSongs);
        setVisibleSongs([]); // איפוס כדי לטעון בהדרגה
      } catch (error) {
        console.error("שגיאה בטעינת השירים", error);
      }
      setLoading(false);
    };

    fetchSongs();
  }, [filterType, filterValue]);

  // אנימציה להצגת השירים בהדרגה
  useEffect(() => {
    if (songs.length === 1) {
      setVisibleSongs([songs[0]]);
      return;
    }
      
        let index = 0;
        const interval = setInterval(() => {
          setVisibleSongs((prev) =>{if (prev.length === 0) {
            return [songs[0]];
          } else {
            return [...prev, songs[index]];
          }} );
          index++;
          if (index === songs.length) clearInterval(interval);
        }, 500);
        return () => clearInterval(interval);
      
    }, [songs]);
  if (loading) return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 3,
        textAlign: "center",
        borderRadius: "12px",
        position:"fixed",
        top:"50px"
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <MusicNoteIcon color="primary" />
        רשימת שירים
      </Typography>

      <List sx={{ marginTop: 2 }}>
        {visibleSongs.map((song, index) => (
          <Box key={song.songId}>
            <ListItem
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              {isLogin && <SongOptionsMenu song={song} inPlay={filterType === "playlist" ? Number(filterValue) : 0} />}
              <ListItemText
                primary={song.title}
                secondary={song.artist}
                sx={{ flex: 1, marginLeft: 2 }}
              />
              <AudioPlayer audioUrl={song.filePath} />
            </ListItem>
            {index < visibleSongs.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default ListSongs;
