import React, { useState } from 'react';
import { Dialog, TextField, Button } from '@mui/material';

interface NameFormProps {
    id?: number;
    name: string;
    onClose: (name:string,id?:number) => void;
}

const NameForm: React.FC<NameFormProps> = ({  id, name, onClose }) => {
    const [playName, setPlayName] = useState(name);

    const handleAdd = () => {
        onClose(playName,id);
        setPlayName('');
    };

    return (
        <Dialog open={true} >
            <div style={{ padding: '20px' }}>
                <TextField
                    label="Name"
                    value={playName}
                    onChange={(e) => setPlayName(e.target.value)}
                    fullWidth
                />
                <Button onClick={handleAdd} style={{ marginTop: '10px' }}>
                    הוסף
                </Button>
            </div>
        </Dialog>
    );
};

export default NameForm;
