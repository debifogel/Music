"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MusicIcon } from "lucide-react"
import AwsUpload from "./AwsUpload"
import addSong from "../Services/AddSong"
import { Switch } from "@mui/material"

const AddSong = () => {
  const route = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    filePath: "",
    isPrivate: false,
  })
  const [file, setFile] = useState<File | null>(null)
  const [addFile, setAddFile] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleClick = () => setFormData({ ...formData, isPrivate: !formData.isPrivate })

  const handleFile = async (file: File, path: string) => {
    setFile(file)
    setAddFile(true)
    setFormData({ ...formData, filePath: path })
    await new Promise((resolve) => setTimeout(resolve, 1000));

    handleSubmit()
  }
  
  const handleSubmit = async () => {
    
      if (file) {
        await addSong(formData)
        route("/songs/all")
      } else {
        console.error("File is null")
        toast.error("File is null", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
    } 
    
  

  return (
    <>
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <Card className="shadow-lg border-t-4 border-t-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <MusicIcon className="h-5 w-6 text-blue-500" />
              הוספת שיר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form  className="space-y-1">
              <div className="space-y-1">
                <div className="space-y-1">
                  <Label htmlFor="title">כותרת</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="שם השיר"
                    className="text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="artist">אמן</Label>
                  <Input
                    id="artist"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    placeholder="שם האמן"
                    className="text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="genre">ז'אנר</Label>
                  <Input
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder="סגנון מוזיקלי"
                    className="text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-end">
                    <span>האם להגדיר את השיר כפרטי?</span>
                    {!formData.isPrivate && <span className="text-sm text-cyan-600">ציבורי</span>}
                    {formData.isPrivate && <span className="text-sm text-purple-700">פרטי</span>}
                  </div>
                  <Switch checked={formData.isPrivate} onChange={handleClick} />
                </div>
              </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <AwsUpload callback={handleFile} />
                </div>            
            </form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </>
  )
}

export default AddSong
