import folderService from "@/Services/FolderService";
import { CircularProgress,Grid2 as Grid } from "@mui/material";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Folder {
  folderId: number;
  userId: number;
  folderName: string;
  parentFolderId: number | null;
}
 const Folders=()=>{
      const [folders, setFeldors] = useState<Folder[]>([]);
      const [loading, setLoading] = useState(true);   
      const [visibleFolders, setVisibleFolders] = useState<Folder[]>([]);

      useEffect(() => {
        const fetchFolders = async () => {
          setLoading(true);
          try {
            let fetchedFolders: Folder[] =await folderService.getAllFolders();
            setFeldors(fetchedFolders);
            setVisibleFolders([]); // איפוס כדי לטעון בהדרגה
          
          } catch (error) {
            console.error("שגיאה בטעינת השירים", error);
          }
          setLoading(false);
        };
    
        fetchFolders();
      }, []);
  useEffect(() => {
    if (folders.length === 1) {
      setVisibleFolders([folders[0]]);
      return;
    }
        let index = 0;
        const interval = setInterval(() => {
          setVisibleFolders((prev) =>{ if (prev.length === 0) {
            return [folders[0]];
          } else {
            return [...prev, folders[index]];
          }});
          index++;
          if (index === folders.length) clearInterval(interval);
        }, 500);
        return () => clearInterval(interval);
      
    }, [folders]);
  
    if (loading) return <CircularProgress />;
    return (
      <>
      <Grid container spacing={8} sx={{position:"fixed",top:"100px"}}>
      {visibleFolders.filter(f=>f).map((folder)=>
        <Grid key={folder.folderId} size={4} >   
      <Link key={folder.folderId} to={`songs/folder/${folder.folderId}`} >
      {folder.folderName}
      <Folder/></Link>
      </Grid> )}
      </Grid>
      </>
    )
  
}
export default  Folders 


