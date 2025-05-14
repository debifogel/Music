import { Button, Input } from "@mui/material"
import { useState } from "react"
import { Link, Outlet } from "react-router-dom"

function Home() {
 let [search, setSearch] = useState("")
  return (
    <>
    <div style={{position:"fixed",top:"300px"}}>
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
    <Outlet/>
    </div>
    </>
  )
}


export default Home
