import playlistService from "@/Services/PlaylistService";
import {Button,  CircularProgress, Dialog, Grid2 as Grid, TextField } from "@mui/material";
import { Folder, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

interface Playlist {
   playlistId: number;
   userId: number;
   playlistName: string;
   creationDate: string; // או Date, בהתאם לאופן הטיפול בתאריכים
 }
 
function  PlayLists()  {
  const route=useNavigate()
      const [playlists, setPlaylists] = useState<Playlist[]>([]);
      const [loading, setLoading] = useState(true);   
      const [visiblePlaylists, setVisiblePlaylists] = useState<Playlist[]>([]);
      const [addPlay,setAddPlay]=useState(false);
      const[playName,setPlayName]=useState('')
      useEffect(() => {
        const fetchPlaylists = async () => {
          setLoading(true);
          try {
            let fetchedPlaylists: Playlist[] =await playlistService.getAllPlaylists();
            setPlaylists(fetchedPlaylists);
            setVisiblePlaylists([]); // איפוס כדי לטעון בהדרגה
          
          } catch (error) {
            console.error("שגיאה בטעינת השירים", error);
          }
          setLoading(false);
        };
    
        fetchPlaylists();
      }, []);
  useEffect(() => {
    if (playlists.length === 1) {
      setVisiblePlaylists([playlists[0]]);
      return;
    }
      
        let index = 0;
        const interval = setInterval(() => {
          setVisiblePlaylists((prev) =>{if (prev.length === 0) {
            return [playlists[0]];
          } else {
            return [...prev, playlists[index]];
          }} );
          index++;
          if (index === playlists.length) clearInterval(interval);
        }, 500);
        return () => clearInterval(interval);
      
    }, [playlists]);
  const handleAdd=()=>
  {
    try{
     playlistService.addPlaylist(playName).then(()=>{route("/playlists")
    console.log("playlist added")})
    }
    catch{
      console.error("dont add the playlist")
    }
  }
  // const handleDelete=(id:number)=>
  // {
  //   try{
  //     playlistService.deletePlaylist(id).then(()=>route("/playlists"))
  //     }
  //     catch{
  //       console.error("dont delete the playlist")

  //     }
  // }
  // const handleUpdate=(id:number)=>
  //   {
  //     try{
  //       playlistService.renamePlaylist(id,playName).then(()=>route("/playlists"))
  //       }
  //       catch{
  //         console.error("dont update the playlist")
  
  //       }
  //   }
    if (loading) return <CircularProgress />;
    return (
      <>
      
      <Button onClick={()=>setAddPlay(true)} sx={{position:"fixed", top:"30px"}}><Plus/> הוספת רשימת השמעה</Button>
      
      <Dialog open={addPlay==true}>
        <TextField label="Name" value={playName} onChange={(e)=>setPlayName(e.target.value)}></TextField>
        <Button onClick={handleAdd}>הוסף</Button>
      </Dialog>
      <Grid container spacing={8} sx={{position:"fixed",top:"100px"}} >
      {visiblePlaylists.filter(p=>p).map((playlist)=> 
      <Grid key={playlist.playlistId} size={4}>   
      <Link key={playlist.playlistId} to={`songs/playlist/${playlist.playlistId}`}>{playlist.playlistName}
      <Folder/></Link>
      </Grid> )}  
      </Grid> 
      <Outlet/>   
      </>
    )
  
}

export default  PlayLists
