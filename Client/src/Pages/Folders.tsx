
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import folderService from "@/Services/FolderService"
import type { Folder as IFolder } from "@/Models/folder"
import {  Music } from "lucide-react"

import { Box, CircularProgress, Typography } from "@mui/material"
import { keyframes } from "@emotion/react"
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`
const style_loading = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  animation: `${pulse} 1.5s infinite ease-in-out`,
}

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
      {loading && 
        <Box sx={style_loading}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#6d8de1" }} />
          <Typography variant="h6" sx={{ color: "#6d8de1", fontWeight: "500" }}>
            טוען אמנים...
          </Typography>
        </Box>
      }
      {folders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-end">
          {folders.map((folder) => (
            <div key={folder.folderId} className="w-full">
              <Link to={`songs/folder/${folder.folderId}`} className="block w-full h-full no-underline">
                <div className="folder-container">
                  <div className="folder-tab"></div>
                  <div className="folder">
                    <div className="folder-content">
                      <h3 className="text-lg font-medium text-center text-white mb-2 mt-4 dir-rtl">
                        {folder.folderName}
                      </h3>
                      <div className="folder-files">
                        <Music size={16} className="text-blue-100 mx-1" />
                        <Music size={16} className="text-blue-100 mx-1" />
                        <Music size={16} className="text-blue-100 mx-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      {folders.length === 0 && !loading && (
        <div className="col-span-full flex justify-center w-full">
          <div className="bg-gray-50 rounded-lg p-8 text-center w-full max-w-md">
            <div className="empty-folder mx-auto mb-4"></div>
            <p className="text-xl text-gray-500 font-medium">אין תיקיות זמינות</p>
          </div>
        </div>
      )}

      <style>{`
        .folder-container {
          position: relative;
          height: 180px;
          perspective: 800px;
          transition: all 0.3s ease;
        }
        
        .folder-container:hover {
          transform: translateY(-5px);
        }
        
        .folder-container:hover .folder {
          transform: rotateX(10deg);
          box-shadow: 0 15px 20px rgba(0, 0, 0, 0.15);
        }
        
        .folder-tab {
          position: absolute;
          top: 0;
          right: 20px;
          width: 60px;
          height: 20px;
          border-radius: 5px 5px 0 0;
          background-color: #2563eb;
          z-index: 2;
          box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .folder {
          position: relative;
          width: 100%;
          height: 160px;
          margin-top: 20px;
          background-color: #3b82f6;
          border-radius: 5px;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
          z-index: 1;
        }
        
        .folder:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 30px;
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .folder-content {
          position: relative;
          padding: 15px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .folder-files {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
        
        .empty-folder {
          position: relative;
          width: 80px;
          height: 60px;
          background-color: #93c5fd;
          border-radius: 5px;
        }
        
        .empty-folder:before {
          content: '';
          position: absolute;
          top: -10px;
          right: 15px;
          width: 30px;
          height: 10px;
          border-radius: 5px 5px 0 0;
          background-color: #93c5fd;
        }
        
        .dir-rtl {
          direction: rtl;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          
        }
      `}</style>
    </div>
  )
}

export default Folders
