import { Home, Headphones, Music, Album } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import SearchSong from "./SearchSongs"


const items = [
  { title: "בית", url: "/home", icon: Home },
  { title: "שירים", url: "/songs/all", icon: Headphones },
  { title: "אמנים", url: "/folders", icon: Album },
  { title: "רשימות השמעה", url: "/playlists", icon: Music },
]

function AppSidebar() {
  
  

  return (
    <Sidebar collapsible="icon"  className="bg-white shadow-lg rounded-lg w-64">
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
<SearchSong/>
        
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
