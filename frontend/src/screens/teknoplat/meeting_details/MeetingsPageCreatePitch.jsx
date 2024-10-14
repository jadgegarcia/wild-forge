import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { PitchesService } from '../../../services';

export default function MeetingsPageCreatePitch({
  open,
  handleClose,
  team,
  updateTeam,
  isCreate = true,
}) {
  const [formData, setFormData] = useState({
    name: team?.pitch?.name ?? '',
    description: team?.pitch?.description ?? '',
    team: team?.id,
    presentor: team?.presentorId,
    team_name: team?.name,
    course: localStorage.getItem('course'),
    pitchId: team?.pitch?.id,
  });

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    if (isCreate) {
      await PitchesService.create({
        name: formData.name,
        description: formData.description,
        team_id: formData.team,
        presentor_id: formData.presentor,
      });
    } else {
      await PitchesService.update(formData.pitchId, {
        name: formData.name,
        description: formData.description,
        team_id: formData.team,
        presentor_id: formData.presentor,
      });
    }
    updateTeam(formData);
    handleClose();
    window.location.reload();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { width: 'calc(100vw * .3)' } }}
    >
      <DialogTitle>
        {isCreate ? 'Create your pitch' : 'Update your pitch'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          disabled={formData.name === '' || formData.description === ''}
        >
          Save
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
