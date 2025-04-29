import React, { useState, useEffect } from 'react';
import {Avatar,Dialog,DialogActions,DialogContent,DialogTitle,TextField,Button,Paper,Typography,IconButton,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import authService from '@/Services/Auth';
import userService from '@/Services/user';
interface UserDetails {name: string;email: string;password:string}
interface AvatarAndUpdateProps {logout: () => void;}
const AvatarAndUpdate= ({ logout }: AvatarAndUpdateProps) => {
    const [menuOpen, setMenuOpen] = useState(false); // דגל לפתיחת התפריט
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);   
    useEffect(() => {
        const user = authService.getUserNameFromToken();
        const email = authService.getEmailFromToken();
        if (user && email) {
            setUserDetails({name: user,email: email,password:""});
        }
    }, []);
    const handleAvatarClick = () => {
        if (!userDetails) {
            console.error('User is not logged in');
            return;
        }        
        setMenuOpen(true); 
    };
    const handleMenuClose = () => setMenuOpen(false);
    const handleUpdateDetails = () => {
        setDialogOpen(true);
        handleMenuClose();
    };
    const handleDialogClose = () =>setDialogOpen(false);
    const handleLogout = () => {
        authService.logout();
        setUserDetails(null);
        handleMenuClose();
        logout()
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails!,
            [name]: value,
        }));
    };
    const handleSaveDetails = async() => {
        await userService.updateUser({username:userDetails?.name||"",email:userDetails?.email||""})
        setDialogOpen(false);
        setMenuOpen(false)
    };
    if (!userDetails) {
        return null;
    }
    return (
        <>
            <Button onClick={handleAvatarClick} // כפתור שמגיב בלחיצה
                sx={{borderRadius:"30px", height:"55px" ,position:"fixed",right:"100px",top:"10px"}}>
            <Avatar style={{ cursor: 'pointer', backgroundColor: '#3f51b5' }}>{userDetails.name.charAt(0)} </Avatar>    
            </Button>
    <Dialog open={menuOpen} onClose={handleMenuClose}>
    <Paper elevation={8}
        sx={{ maxWidth: 320, padding: 3, textAlign: "center", borderRadius: "12px", 
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,}}
     >
         <IconButton onClick={handleMenuClose}
            sx={{position: "absolute",top: 8,right: 8,}}
        >
        <CloseIcon />
        </IconButton>
        <Avatar sx={{ width: 60, height: 60, bgcolor: "primary.main" }}>{userDetails.name.charAt(0)}</Avatar>
        <Typography variant="h6" fontWeight="bold">{userDetails.name}</Typography>
        <Typography variant="body1" color="text.secondary">{userDetails.email}</Typography>
        <Button variant="contained" color="primary" fullWidth onClick={handleUpdateDetails}>
            Update Details
        </Button>
        <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
            Logout
        </Button>
    </Paper>
</Dialog>
<Dialog open={dialogOpen} onClose={handleDialogClose}>  {/*  for updating details */}
        <DialogTitle>Update Details</DialogTitle>
            <DialogContent>
                    <TextField margin="dense" label="Name" name="name" fullWidth value={userDetails.name} onChange={handleInputChange} />
                    <TextField margin="dense" label="Email" name="email" fullWidth value={userDetails.email} onChange={handleInputChange}/>
                    <TextField margin="dense" label="Password" name="password" fullWidth value={userDetails.password} onChange={handleInputChange} />       
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
                <Button onClick={handleSaveDetails} color="primary">Save</Button>
            </DialogActions>
</Dialog>
        </>
    );};

export default AvatarAndUpdate;
