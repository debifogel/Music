import { Home, Headphones, Search, Music, Album } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import {
  TextField,
  InputAdornment,
  Popover,
  Box,
  useTheme,
} from "@mui/material"
import { useState, useRef } from "react"

const items = [
  { title: "בית", url: "/home", icon: Home },
  { title: "שירים", url: "/songs/all", icon: Headphones },
  { title: "אמנים", url: "/folders", icon: Album },
  { title: "רשימות השמעה", url: "/playlists", icon: Music },
]

function AppSidebar() {
  const { collapsed } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const searchBtnRef = useRef(null)

  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("🔍 מחפש:", searchQuery)
      setAnchorEl(null)
    }
  }

  const open = Boolean(anchorEl)

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>musicling</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

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
      </SidebarContent>
    </Sidebar>
  )
}


export function NavBar() {
  return (
    <SidebarProvider style={{ position: "absolute", top: "20px", left: "10px" }}>
      <AppSidebar />
      <main>
        <SidebarTrigger className="sidebar-toggle" />
      </main>
    </SidebarProvider>
  )
}
