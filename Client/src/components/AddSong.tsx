import React, { useState } from 'react';
import { TextField, Button, Grid2 as Grid, Typography, Switch, Paper } from '@mui/material';
import AwsUpload from './AwsUpload';
import addSong from '../Services/AddSong';
import {  useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
const AddSong = () => {
      const route=useNavigate()
      const [formData, setFormData] = useState({
         title: '',artist: '',genre: '',filePath: '',isPrivate: false
      });
      const [file, setFile] = useState<File | null>(null);
     const [addFile,setAddFile]=useState(false)
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const { name, value } = e.target;
         setFormData({ ...formData, [name]: value });
      };
      const handleClick=()=> setFormData({...formData,isPrivate:!formData.isPrivate})
      const handleFile=async(file:File,path:string)=>
      {
         setFile(file)
          setAddFile(true)
          setFormData({...formData,filePath:path})
      }
      const handleSubmit = async(e: React.FormEvent) => {
         e.preventDefault();
         if(addFile)
         {
           if (file) {
               await addSong( formData);
               route('/songs/all')          
           } else {
               console.error("File is null");
               toast.error("File is null", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
               });
             }
        } else {
            console.log("the client doesnt add file")    
       
        }
        console.log("in add song fail")
      toast.error("Failed to add the song. Please try again.", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
      });
      };

      return (
         <>
          <Paper elevation={3}
               sx={{
                 maxWidth: 600,
                 padding: 2,
                 textAlign: "center",
                 borderRadius: "12px",
                 position: "fixed",
                 top: "2px",
               }}
             >
            <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>  Add Song </Typography>
            <Grid container spacing={2}>            
                  <Grid container spacing={1}  alignContent={"center"}>
                  <Grid size={8}>
                  <TextField                    
                     label="Title"
                     name="title"
                     value={formData.title}
                     onChange={handleChange}
                     variant="outlined"
                  />
               </Grid>
               <Grid  size={8}>
                  <TextField                    
                     label="Artist"
                     name="artist"
                     value={formData.artist}
                     onChange={handleChange}
                     variant="outlined"
                     
                  />
               </Grid>
               <Grid size={8}>
                  <TextField                    
                     label="Genre"
                     name="genre"
                     value={formData.genre}
                     onChange={handleChange}
                     variant="outlined"
                  />
               </Grid>
               </Grid>
               <Grid size={6}>
               <AwsUpload callback={handleFile}/>
               </Grid>
               <Grid size={5}>
                  <span>האם להגדיר את השיר כפרטי?</span>
                  {!formData.isPrivate&&<h6 style={{color:'rgb(61, 231, 231)'}}>ציבורי</h6>}
                  {formData.isPrivate&&<h6 style={{color:'rgb(98, 20, 214)'}}>פרטי</h6>}
                  <Switch name="isPrivate" value={formData.isPrivate} onClick={handleClick} />
               </Grid>
               <Grid size={5}>
                  <Button type="submit" disabled={!formData.filePath} variant="outlined" color="secondary">
                     הוספה
                  </Button>            
               </Grid>
            </Grid>
         </form> 
         </Paper> 
             <ToastContainer />
             </>               
   );
};
export default AddSong;
  