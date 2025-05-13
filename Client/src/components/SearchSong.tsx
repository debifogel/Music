import React, { useState } from 'react';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchSong = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '20px' }}>
      <TextField
      label="Search"
      variant="outlined"
      fullWidth
      value={searchQuery}
      onChange={handleSearchChange}
      
      style={{
        maxHeight: '30px',
        maxWidth: '600px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
      }}
      />
      
    </div>
  );
};

export default SearchSong;
