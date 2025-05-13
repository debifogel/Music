import folderService from "@/Services/FolderService";
import { CircularProgress, Grid2 as Grid, Card, CardContent, Typography } from "@mui/material";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Folder as IFolder} from "@/Models/folder"

const Folders = () => {
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [loading, setLoading] = useState(true);
 const style_container={
  position: "fixed",
  top: "100px",     
  left: "300px",    
  width: "60%",
  height: "calc(100vh - 120px)", 
  padding: 3,
  margin:"10px",
  overflowY: "auto",      
  scrollbarWidth: "none",  
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "right",
 }
 const style_card={
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 3,
  minHeight: "150px",
  minWidth: "120px",
  borderRadius: 3,
  boxShadow: 3,
  transition: "0.3s",
  "&:hover": { transform: "scale(1.05)", boxShadow: 5 },
  backgroundColor: "#f8f9fa",
}
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const fetchedFolders: IFolder[] = await folderService.getAllFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error(" שגיאה בטעינת תיקיות:", error);
    }
    setLoading(false);
  };
  return (
    <>
    {loading&& <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />}
    <Grid container spacing={3} 
    sx={style_container}>
      {folders.length > 0 ? (
        folders.map((folder) => (
          <Grid size={4} key={folder.folderId}>
            <Card sx={style_card}>
              <Link to={`songs/folder/${folder.folderId}`} style={{ textDecoration: "none", textAlign: "center", width: "100%" }}>
                <Folder size={48} color="#1976d2" />
                <CardContent>
                  <Typography variant="h6" color="textPrimary">
                    {folder.folderName}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h6" sx={{ marginTop: 5, color: "gray" }}>
          אין תיקיות זמינות
        </Typography>
      )}
    </Grid>
    </>
  );
};

export default Folders;
