import React from 'react';
import { TextField } from '@mui/material';

const Search = ({ search, setSearch, text }) => {
  return (
    <TextField
      label={text}
      variant="outlined"
      // Remove fullWidth or set it to false
      margin="normal"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        width: '300px', // Set your desired width here
        '& .MuiInputBase-root': {
          height: '40px',
          fontSize: '14px',
        },
        '& .MuiInputLabel-root': {
          fontSize: '14px',
          alignItems: 'center',
          transform: 'translate(14px, 10px) scale(1)',
          '&.Mui-focused': {
            transform: 'translate(14px, -6px) scale(0.75)',
          },
        },
      }}
    />
  );
};

export default Search;