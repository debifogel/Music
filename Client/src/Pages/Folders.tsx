"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import folderService from "@/Services/FolderService"
import type { Folder as IFolder } from "@/Models/folder"
import { Folder } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const Folders = () => {
  const [folders, setFolders] = useState<IFolder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    setLoading(true)
    try {
      const fetchedFolders: IFolder[] = await folderService.getAllFolders()
      setFolders(fetchedFolders)
    } catch (error) {
      console.error("שגיאה בטעינת תיקיות:", error)
    }
    setLoading(false)
  }

  return (
    <div className="fixed top-[100px] left-[300px] w-[60%] h-[calc(100vh-120px)] p-6 m-2.5 overflow-y-auto scrollbar-hide">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-end">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full">
              <Skeleton className="h-[180px] w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-end">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <div key={folder.folderId} className="w-full">
                <Link to={`songs/folder/${folder.folderId}`} className="block w-full h-full no-underline">
                  <Card className="h-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[180px]">
                      <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <Folder size={48} className="text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium text-center text-gray-800 mt-2">{folder.folderName}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center w-full">
              <div className="bg-gray-50 rounded-lg p-8 text-center w-full max-w-md">
                <Folder size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500 font-medium">אין תיקיות זמינות</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Folders






// import folderService from "@/Services/FolderService";
// import { CircularProgress, Grid2 as Grid, Card, CardContent, Typography } from "@mui/material";
// import { Folder } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {Folder as IFolder} from "@/Models/folder"

// const Folders = () => {
//   const [folders, setFolders] = useState<IFolder[]>([]);
//   const [loading, setLoading] = useState(true);
//  const style_container={
//   position: "fixed",
//   top: "100px",     
//   left: "300px",    
//   width: "60%",
//   height: "calc(100vh - 120px)", 
//   padding: 3,
//   margin:"10px",
//   overflowY: "auto",      
//   scrollbarWidth: "none",  
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "right",
//  }
//  const style_card={
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: 3,
//   minHeight: "150px",
//   minWidth: "120px",
//   borderRadius: 3,
//   boxShadow: 3,
//   transition: "0.3s",
//   "&:hover": { transform: "scale(1.05)", boxShadow: 5 },
//   backgroundColor: "#f8f9fa",
// }
//   useEffect(() => {
//     fetchFolders();
//   }, []);

//   const fetchFolders = async () => {
//     setLoading(true);
//     try {
//       const fetchedFolders: IFolder[] = await folderService.getAllFolders();
//       setFolders(fetchedFolders);
//     } catch (error) {
//       console.error(" שגיאה בטעינת תיקיות:", error);
//     }
//     setLoading(false);
//   };
//   return (
//     <>
//     {loading&& <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />}
//     <Grid container spacing={3} 
//     sx={style_container}>
//       {folders.length > 0 ? (
//         folders.map((folder) => (
//           <Grid size={4} key={folder.folderId}>
//             <Card sx={style_card}>
//               <Link to={`songs/folder/${folder.folderId}`} style={{ textDecoration: "none", textAlign: "center", width: "100%" }}>
//                 <Folder size={48} color="#1976d2" />
//                 <CardContent>
//                   <Typography variant="h6" color="textPrimary">
//                     {folder.folderName}
//                   </Typography>
//                 </CardContent>
//               </Link>
//             </Card>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" sx={{ marginTop: 5, color: "gray" }}>
//           אין תיקיות זמינות
//         </Typography>
//       )}
//     </Grid>
//     </>
//   );
// };

// export default Folders;
