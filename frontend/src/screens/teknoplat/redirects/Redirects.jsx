import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export function Redirects() {
  const navigate = useNavigate();
  const { classId } = useOutletContext();

  const initLoading = localStorage.getItem('loadingRedirect')
    ? JSON.parse(localStorage.getItem('loadingRedirect'))
    : true;
  const [loading, setLoading] = useState(initLoading);

  useEffect(() => {
    if (loading) {
      localStorage.setItem('loadingRedirect', false);
      setLoading(false);
      navigate(0);
    } else {
      localStorage.removeItem('loadingRedirect');
      navigate(`/classes/${classId}/teknoplat`);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px - 190px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="h5" textAlign="center">
          Leaving meeting...
        </Typography>
      </Box>
    </Box>
  );
}
