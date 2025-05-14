import { Popover, TextField, InputAdornment } from "@mui/material"
import { Search } from "lucide-react"
import { Box } from "@mui/material"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

const SearchSong=()=>{
    const { collapsed = false } = useSidebar() as { collapsed?: boolean }
  const [searchQuery, setSearchQuery] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const searchBtnRef = useRef(null)

    const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget)
      }
    
      const navigate = useNavigate();
  
      const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            console.log("🔍 מחפש:", searchQuery)
            setAnchorEl(null)
            navigate(`/songs/search/${searchQuery}`)
            setSearchQuery("") // לנקות את תיבת החיפוש לאחר החיפוש
          }
        }
    
      const open = Boolean(anchorEl)
    return(<>
{/* כפתור חיפוש */}
<div className="mb-4 px-2">
<SidebarMenu>
  <SidebarMenuItem>
    <SidebarMenuButton
      ref={searchBtnRef}
      onClick={handleSearchClick}
    >
      <Search />
      {!collapsed && <span>חיפוש</span>}
    </SidebarMenuButton>
  </SidebarMenuItem>
</SidebarMenu>

{/* תיבת חיפוש קופצת לצד כשסגור */}
<Popover
  open={open}
  anchorEl={anchorEl}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{
    vertical: "center",
    horizontal: "right",
  }}
  transformOrigin={{
    vertical: "center",
    horizontal: "left",
  }}
>
  <Box p={2} sx={{ width: 250 }}>
    <TextField
      autoFocus
      fullWidth
      size="small"
      variant="outlined"
      placeholder="חפש שיר, אמן, רשימה..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleSearchKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  </Box>
</Popover>
</div>
</>
)
}
export default SearchSong