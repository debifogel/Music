import folderService from "@/Services/FolderService";
import { CircularProgress, Grid2 as Grid, Card, CardContent, Typography } from "@mui/material";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Folder {
  folderId: number;
  userId: number;
  folderName: string;
  parentFolderId: number | null;
}

const Folders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const fetchedFolders: Folder[] = await folderService.getAllFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error(" שגיאה בטעינת תיקיות:", error);
    }
    setLoading(false);
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;

  return (
    <Grid container spacing={3} sx={{ position: "fixed", top: "100px", left: "300px", padding: 3, marginTop: 5, justifyContent: "center" ,width:"60%"}}>
      {folders.length > 0 ? (
        folders.map((folder) => (
          <Grid size={4} key={folder.folderId}>
            <Card
              sx={{
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
              }}
            >
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
  );
};

export default Folders;
