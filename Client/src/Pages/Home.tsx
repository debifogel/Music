import { Button, Input } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"

function Home() {
 let [search, setSearch] = useState("")
  return (
    <>
    <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="חיפוש שיר"
      sx={{ marginLeft: 2 }}
      />
      <Button
      component={Link}
      to={`/songs/public/${search}`}
      variant="contained"
      color="inherit"
      >
      חפש
      </Button>
    </div>
    </>
  )
}


export default Home
