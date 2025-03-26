import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormEvent, Fragment, useState } from 'react';

interface FormToEnterProps {
  buttonText: string;
  onSubmit: (email: string,password:string,name?:string) => void;
  register:boolean;
}

export default function FormToEnter({ buttonText, onSubmit ,register}: FormToEnterProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email as string; // Type assertion
    const password = formJson.password as string; // Type assertion
    const name = formJson.name as string; // Type assertion
    onSubmit(email,password,name); // Call the parent's onSubmit function
    handleClose();
  };

  return (
    <Fragment>
      <Button variant="outlined" sx={{ 
          borderRadius: '20px', 
          padding: '10px 20px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          
          '&:hover': {
            backgroundColor: 'rgba(63, 81, 181, 0.7)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
          }
        }} onClick={handleClickOpen}>
        {buttonText}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit,
          },
        }}
      >
        <DialogTitle>welcome</DialogTitle>
        <DialogContent>
          <DialogContentText>
            הכנס בבקשה את פרטיך האישיים
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
{register &&
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            label="your name"
            type="name"
            fullWidth
            variant="standard"
          />
}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button type="submit">אישור</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}