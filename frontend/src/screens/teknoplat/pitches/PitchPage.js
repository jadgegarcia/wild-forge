import { Edit } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePitch } from '../../../hooks';
import CreatePitchDialog from './CreatePitchDialog';

function PitchPage() {
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { isRetrieving, pitch } = usePitch(classId);

  const [openDialog, setOpenDialog] = useState(false);

  const [localPitchData, setLocalPitchData] = useState(pitch ?? null);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const updatePitch = (newPitch) => {
    setLocalPitchData(newPitch);
  };

  return (
    <Box>
      {isRetrieving ? (
        <Box />
      ) : (
        <Box>
          {!pitch ? (
            <Button variant="contained" onClick={handleDialogOpen}>
              Create Pitch
            </Button>
          ) : (
            <Grid container spacing={2}>
              <Grid item md={12} sm={12}>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2}>
                    <Typography>{pitch.name}</Typography>
                    <IconButton size="small" onClick={handleDialogOpen}>
                      <Edit fontSize="inherit" />
                    </IconButton>
                  </Stack>
                  <Typography>{pitch.description}</Typography>
                </Stack>
                <CreatePitchDialog
                  open={openDialog}
                  handleClose={handleDialogClose}
                  pitch={pitch}
                  updatePitch={updatePitch}
                  isCreate={false}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}

export default PitchPage;
