"use client"

import { useEffect, useState } from "react"
import { List, ListItem, ListItemText, CircularProgress, Typography, Paper, Box, Divider } from "@mui/material"
import songService from "../Services/SongService"
import songInPlaceService from "@/Services/SongInPlaceService"
import { useParams } from "react-router-dom"
import AudioPlayer from "../components/AudioPlayer"
import SongOptionsMenu from "@/components/OptionSongs"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import type { Song } from "@/Models/song"
import { keyframes } from "@emotion/react"

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const style_container = {
  position: "fixed",
  top: "50px",
  left: "250px",
  width: "60%",
  height: "90vh",
  padding: 3,
  overflowY: "auto",
  scrollbarWidth: "none",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "right",
  // background: "linear-gradient(145deg, #ffffff, #f0f4ff)",
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
}

const style_song = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderRadius: "12px",
  margin: "8px 0",
  transition: "all 0.3s ease",
  animation: `${fadeIn} 0.5s ease forwards`,
  background: "rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.03)",
  "&:hover": {
    backgroundColor: "#f0f7ff",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
  },
}

const style_header = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  padding: "16px 0",
  marginBottom: "16px",
  borderBottom: "2px solid #f0f0f0",
  color: "#4a6baf",
}

const style_loading = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  animation: `${pulse} 1.5s infinite ease-in-out`,
}

const ListSongs = () => {
  const { filterType, filterValue } = useParams() // קבלת פרמטרים מה-URL
  const [songs, setSongs] = useState<Song[]>([])
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [isLogin, setLogin] = useState(true)

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true)
      try {
        let fetchedSongs: Song[] = []

        switch (filterType) {
          case "folder":
            fetchedSongs = await songInPlaceService.getSongsInFolder(Number(filterValue))
            setLogin(true)
            break
          case "playlist":
            fetchedSongs = await songInPlaceService.getSongsInPlaylist(Number(filterValue))
            setLogin(true)

            break
          case "public":
            fetchedSongs = await songService.getAllPublicSongs(filterValue || "")
            setLogin(false)
            break
          case "search":
            fetchedSongs = await songService.searchAndFetchSongs(filterValue || "")
            setLogin(true)
            break
          case "all":
            fetchedSongs = await songService.getAllSongs()
            setLogin(true)

            break
          default:
            console.error("סוג חיפוש לא תקין")
            return
        }

        setSongs(fetchedSongs)
        setVisibleSongs([]) // איפוס כדי לטעון בהדרגה
      } catch (error) {
        console.error("שגיאה בטעינת השירים", error)
      }
      setLoading(false)
    }

    fetchSongs()
  }, [filterType, filterValue])

  // אנימציה להצגת השירים בהדרגה
  useEffect(() => {
    if (songs.length === 0) return // מניעת קריסה במקרה של מערך ריק

    let index = 0
    const interval = setInterval(() => {
      setVisibleSongs((prev) => {
        if (prev.length === 0) {
          return [songs[0]]
        } else {
          return [...prev, songs[index]]
        }
      })

      index++
      if (index === songs.length) clearInterval(interval)
    }, 500)

    return () => clearInterval(interval)
  }, [songs])

  if (loading)
    return (
      <Box sx={style_loading}>
        <CircularProgress size={60} thickness={4} sx={{ color: "#6d8de1" }} />
        <Typography variant="h6" sx={{ color: "#6d8de1", fontWeight: "500" }}>
          טוען שירים...
        </Typography>
      </Box>
    )

  return (
    <>
      {songs.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            ...style_container,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#8c9db5",
              textAlign: "center",
              padding: "40px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            לא נמצאו שירים במיקום זה 🎵
          </Typography>
        </Paper>
      ) : (
        <>
         <Box sx={style_container}>
          <Box sx={style_header}>
            <MusicNoteIcon sx={{ fontSize: 32, color: "#6d8de1" }} />
            <Typography variant="h5" fontWeight="bold">
              רשימת שירים
            </Typography>
          </Box>

          <List sx={{ width: "100%", padding: "0 12px" }}>
            {visibleSongs.map((song, index) => (
              <Box
                key={song.songId}
                sx={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <ListItem sx={style_song}>
                  {isLogin && (
                    <SongOptionsMenu song={song} inPlay={filterType === "playlist" ? Number(filterValue) : 0} />
                  )}
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="500" sx={{ color: "#2c3e50" }}>
                        {song.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                        {song.artist}
                      </Typography>
                    }
                    sx={{ flex: 1, marginLeft: 2 }}
                  />
                  <AudioPlayer audioUrl={song.filePath} />
                </ListItem>
                {index < visibleSongs.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
              </Box>
            ))}
          </List>
         </Box>
        </>
      )}
    </>
  )
}

export default ListSongs
