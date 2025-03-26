import React, { useState } from 'react';
import { TextField, Button, Grid2 as Grid, Typography, Switch } from '@mui/material';
import AwsUpload from './AwsUpload';
import addSong from '../Services/AddSong';
import { useNavigate } from 'react-router-dom';

   const AddSong = () => {
      const route=useNavigate()
      const [formData, setFormData] = useState({
         title: '',
         artist: '',
         genre: '',
       filePath: '',
       isPrivate: false
      });
     const [addFile,setAddFile]=useState(false)
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const { name, value } = e.target;
         setFormData({ ...formData, [name]: value });
      };
      const handleClick=()=>
      {
         setFormData({...formData,isPrivate:!formData.isPrivate})
      }
      const handleFile=async(path:string)=>
      {
          setAddFile(true)
          setFormData({...formData,filePath:path})

      }
      const handleSubmit = async(e: React.FormEvent) => {
         e.preventDefault();
         if(addFile)
         {
           await addSong(formData)
             route('/home')
           
         }
         else{
            console.log("the client doesnt add file")
            
         }
      };

      return (
         <>
            <form onSubmit={handleSubmit} style={{position:"fixed",top:"10px"}}>
            <Typography variant="h6" gutterBottom>
               Add Song
            </Typography>
            <Grid container spacing={2}>
            
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
               <Grid size={8}>
               <AwsUpload callback={handleFile}/>

               </Grid>

               <Grid size={5}>
                  <span>האם להגדיר את השיר כפרטי?</span>
                  {!formData.isPrivate&&<h6 style={{color:'rgb(61, 231, 231)'}}>ציבורי</h6>}
                  {formData.isPrivate&&<h6 style={{color:'rgb(98, 20, 214)'}}>פרטי</h6>}

                  <Switch 
                  name="isPrivate"
                  value={formData.isPrivate}
                  onClick={handleClick}                 
                  />
               </Grid>
               <Grid size={5}>
                  <Button type="submit" disabled={!formData.filePath} variant="outlined" color="secondary">
                     הוספה
                  </Button>
                 
               </Grid>

            </Grid>
         </form>         
            </>         
      );
   };
   export default AddSong;
  