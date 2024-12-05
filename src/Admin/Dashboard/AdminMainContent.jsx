import * as React from 'react';
import Box from '@mui/material/Box';

// eslint-disable-next-line react/prop-types
export default function AdminMainContent({ children }) {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {children}
    </Box>
  );
}
