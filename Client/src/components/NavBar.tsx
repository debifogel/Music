import { Home, Headphones, Search, Music, Album, Plus } from "lucide-react"

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

// Menu items.
const items = [
  {
    title: "בית",
    url: "/home",
    icon: Home,
  },
  {
    title: "שירים",
    url: "/songs/all",
    icon: Headphones, // Assuming Inbox represents the song icon
  },
  {
    title: "אמנים",
    url: "/folders",
    icon: Album,
  },
  {
    title: "רשימות השמעה",
    url: "/playlists",
    icon: Music,
  },
  {
    title: "חיפוש",
    url: "#",
    icon: Search,
  },
  {
    title: "הוספת שיר",
    url: "/add-song",
    icon: Plus,
  },
]

 function AppSidebar() {
  return (
    <>
    <Sidebar collapsible="icon">
      <SidebarContent>
        
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
      </SidebarContent>
    </Sidebar>
</>
    
  )
}


export  function NavBar() {
  return (
<>
<SidebarProvider style={{ position: 'absolute', top: '20px', left: '10px' }}>
      <AppSidebar />
      <main >
        <SidebarTrigger className="sidebar-toggle" />
      </main>
</SidebarProvider>
</>  )
}
