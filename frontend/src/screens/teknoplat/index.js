import React from 'react';
import { useOutletContext, Outlet } from 'react-router-dom';

import 'primeicons/primeicons.css';
import './index.scss';
import { Box, Toolbar, Typography } from '@mui/material';
import Sidebar from './components/sidebar/Sidebar';

function TeknoPlat() {
  const { user, classId, classRoom, classMember } = useOutletContext();
  // TODO: Your screens

  return (
    <Box>
      <Box component="main" sx={{ flexGrow: 1, width: { sm: `100%` } }}>
        <Typography variant="h5" paddingLeft={3}>
          Idea Pitching and Validation
        </Typography>
        <Outlet context={{ user, classId, classRoom, classMember }} />
      </Box>
    </Box>
  );
}

export default TeknoPlat;
