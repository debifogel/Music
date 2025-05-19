"use client"

import { useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import { Plus, Music } from "lucide-react"
import NameForm from "@/components/NameForm"
import OptionsMenu from "@/components/OPtionMenu"
import type { Playlist } from "@/Models/playlist"
import playlistService from "@/Services/PlaylistService"
import { Button } from "@/components/ui/button"

const PlayLists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [addPlay, setAddPlay] = useState(false)
  const [renamePlay, setRenamePlay] = useState(false)
  const [currentPlay, setCurrentPlay] = useState<number | null>(null)
  const [playName, setPlayName] = useState("")
  const [keyLOad, setKeyLOad] = useState(0)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    setLoading(true)
    try {
      const fetchedPlaylists: Playlist[] = await playlistService.getAllPlaylists()
      setPlaylists(fetchedPlaylists)
    } catch (error) {
      console.error("שגיאה בטעינת רשימות ההשמעה:", error)
    }
    setLoading(false)
  }

  const handleAdd = async (name: string) => {
    setAddPlay(false)
    try {
      await playlistService.addPlaylist(name)
      fetchPlaylists() // עדכון הרשימה לאחר ההוספה
    } catch (error) {
      console.error("שגיאה בהוספת רשימת ההשמעה", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await playlistService.deletePlaylist(id)
      setPlaylists(playlists.filter((p) => p.playlistId !== id)) // עדכון מיידי של הסטייט
    } catch (error) {
      console.error("שגיאה במחיקת רשימת ההשמעה", error)
    }
  }

  const handleUpdate = async (name: string, id?: number) => {
    setRenamePlay(false)
    if (!id) return
    try {
      await playlistService.renamePlaylist(id, name)
      setPlaylists(playlists.map((p) => (p.playlistId === id ? { ...p, playlistName: name } : p))) // עדכון מיידי של הסטייט
    } catch (error) {
      console.error("שגיאה בעדכון רשימת ההשמעה", error)
    }
    setKeyLOad((prev) => prev + 1)
    console.log(keyLOad + "render in the playlists")
  }

  const rename = (id: number, name: string) => {
    setPlayName(name)
    setRenamePlay(true)
    setCurrentPlay(id)
  }

  return (
    <>
      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}

      <Button
        onClick={() => setAddPlay(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-full px-4 py-2 shadow-lg"
      >
        <Plus size={20} />
        <span className="dir-rtl ">הוספת רשימת השמעה</span>
      </Button>

      {addPlay && <NameForm name={""} onClose={handleAdd} />}
      {renamePlay && currentPlay !== null && <NameForm name={playName} id={currentPlay} onClose={handleUpdate} />}

      <div className="fixed top-[100px] left-[300px] w-[60%] h-[calc(100vh-120px)] p-6 m-2.5 overflow-y-auto scrollbar-hide">
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-end">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div key={playlist.playlistId} className="w-full">
                  <div className="playlist-container">
                    <div className="folder-tab"></div>
                    <div className="folder">
                      <div className="folder-content">
                        <Link
                          to={`songs/playlist/${playlist.playlistId}`}
                          className="no-underline text-white flex flex-col items-center"
                        >
                          <h3 className="text-lg font-medium text-center text-white mb-2 mt-4 dir-rtl">
                            {playlist.playlistName}
                          </h3>
                          <div className="playlist-icons">
                            <Music size={16} className="text-blue-100 mx-1" />
                            <Music size={16} className="text-blue-100 mx-1" />
                            <Music size={16} className="text-blue-100 mx-1" />
                          </div>
                        </Link>
                        <div className="options-menu-container">
                          <OptionsMenu
                            options={[
                              { id: 1, title: "מחק", func: () => handleDelete(playlist.playlistId) },
                              { id: 2, title: "ערוך", func: () => rename(playlist.playlistId, playlist.playlistName) },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center w-full">
                <div className="bg-gray-50 rounded-lg p-8 text-center w-full max-w-md">
                  <div className="empty-folder mx-auto mb-4"></div>
                  <p className="text-xl text-gray-500 font-medium">אין רשימות השמעה זמינות</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style >{`
        .playlist-container {
          position: relative;
          height: 180px;
          perspective: 800px;
          transition: all 0.3s ease;
        }
        
        .playlist-container:hover {
          transform: translateY(-5px);
        }
        
        .playlist-container:hover .folder {
          transform: rotateX(10deg);
          box-shadow: 0 15px 20px rgba(0, 0, 0, 0.15);
        }
        
        .folder-tab {
          position: absolute;
          top: 0;
          right: 20px;
          width: 60px;
          height: 20px;
          border-radius: 5px 5px 0 0;
          background-color: #2563eb; /* Darker blue for tab */
          z-index: 2;
          box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .folder {
          position: relative;
          width: 100%;
          height: 160px;
          margin-top: 20px;
          background-color: #3b82f6; /* Main blue color */
          border-radius: 5px;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
          z-index: 1;
        }
        
        .folder:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 30px;
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .folder-content {
          position: relative;
          padding: 15px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .playlist-icons {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
        
        .empty-folder {
          position: relative;
          width: 80px;
          height: 60px;
          background-color: #93c5fd; /* Light blue for empty folder */
          border-radius: 5px;
        }
        
        .empty-folder:before {
          content: '';
          position: absolute;
          top: -10px;
          right: 15px;
          width: 30px;
          height: 10px;
          border-radius: 5px 5px 0 0;
          background-color: #93c5fd; /* Light blue for empty folder tab */
        }
        
        .dir-rtl {
          direction: rtl;
        }
        
        .options-menu-container {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
      `}</style>

      <Outlet />
    </>
  )
}

export default PlayLists





// import NameForm from "@/components/NameForm";
// import OptionsMenu from "@/components/OPtionMenu";
// import { Playlist } from "@/Models/playlist";
// import playlistService from "@/Services/PlaylistService";
// import { Button, CircularProgress, Grid2 as Grid, Typography, Paper } from "@mui/material";
// import { Folder, Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Link, Outlet } from "react-router-dom";

// const style_container={
//   position: "fixed",
//   top: "100px",     
//   left: "300px",    
//   width: "60%",
//   height: "calc(100vh - 120px)", 
//   padding: 3,
//   margin:"10px",
//   overflowY: "auto",      
//   scrollbarWidth: "none",  
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "right",
//  }
//  const style_card={
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: 3,
//   minHeight: "150px",
//   minWidth: "120px",
//   borderRadius: 3,
//   boxShadow: 3,
//   transition: "0.3s",
//   "&:hover": { transform: "scale(1.05)", boxShadow: 5 },
//   backgroundColor: "#f8f9fa",
// }

// const PlayLists = () => {
//   const [playlists, setPlaylists] = useState<Playlist[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [addPlay, setAddPlay] = useState(false);
//   const [renamePlay, setRenamePlay] = useState(false);
//   const [currentPlay, setCurrentPlay] = useState<number | null>(null);
//   const [playName, setPlayName] = useState("");
// const [keyLOad,setKeyLOad]=useState(0)
//   useEffect(() => {
//     fetchPlaylists();
//   }, []);

//   const fetchPlaylists = async () => {
//     setLoading(true);
//     try {
//       const fetchedPlaylists: Playlist[] = await playlistService.getAllPlaylists();
//       setPlaylists(fetchedPlaylists);
//     } catch (error) {
//       console.error("שגיאה בטעינת רשימות ההשמעה:", error);
//     }
//     setLoading(false);
//   };

//   const handleAdd = async (name: string) => {
//     setAddPlay(false);
//     try {
//       await playlistService.addPlaylist(name);
//       fetchPlaylists(); // עדכון הרשימה לאחר ההוספה
//     } catch (error) {
//       console.error("שגיאה בהוספת רשימת ההשמעה", error);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await playlistService.deletePlaylist(id);
//       setPlaylists(playlists.filter((p) => p.playlistId !== id)); // עדכון מיידי של הסטייט
//     } catch (error) {
//       console.error("שגיאה במחיקת רשימת ההשמעה", error);
//     }
//   };

//   const handleUpdate = async (name: string, id?: number) => {
//     setRenamePlay(false);
//     if (!id) return;
//     try {
//       await playlistService.renamePlaylist(id, name);
//       setPlaylists(
//         playlists.map((p) =>
//           p.playlistId === id ? { ...p, playlistName: name } : p
//         )
//       ); // עדכון מיידי של הסטייט
//     } catch (error) {
//       console.error("שגיאה בעדכון רשימת ההשמעה", error);
//     }
//     setKeyLOad(prev=>prev+1)
//    console.log(keyLOad+"render in the playlists")
//   };

//   const rename = (id: number, name: string) => {
//     setPlayName(name);
//     setRenamePlay(true);
//     setCurrentPlay(id);
//   };
//   return (
//     <>
//     { loading&&<CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
//       <Button
//         onClick={() => setAddPlay(true)}
//         variant="contained"
//         color="primary"
//         startIcon={<Plus />}
//         sx={{ position: "fixed", buttom: "0px", right: "20px", zIndex: 1000 }}
//       >
//         הוספת רשימת השמעה
//       </Button>
//       {addPlay && <NameForm name={""} onClose={handleAdd} />}
//       {renamePlay && currentPlay !== null && (
//         <NameForm name={playName} id={currentPlay} onClose={handleUpdate} />
//       )}
//       <Grid container spacing={3} sx={style_container}>
//         {playlists.length > 0 ? (
//           playlists.map((playlist) => (
//             <Grid  size={4}  key={playlist.playlistId}>
//               <Paper elevation={3} sx={style_card}>
//                 <Link to={`songs/playlist/${playlist.playlistId}`} style={{ textDecoration: "none", color: "inherit" }}>
//                   <Folder size={40} color="blue" />
//                   <Typography variant="h6" sx={{}}>{playlist.playlistName}</Typography>
//                 </Link>
//                 <OptionsMenu
//                   options={[
//                     { id: 1, title: "מחק", func: () => handleDelete(playlist.playlistId) },
//                     { id: 2, title: "ערוך", func: () => rename(playlist.playlistId, playlist.playlistName) },
//                   ]}
//                 />
//               </Paper>
//             </Grid>
//           ))
//         ) : (
//           <Typography variant="h6" sx={{ marginTop: 5, color: "gray" }}>
//             אין רשימות השמעה זמינות
//           </Typography>
//         )}
//       </Grid>
//       <Outlet />
//     </>
//   );
// };
// export default PlayLists;



