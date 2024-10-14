import PropTypes from 'prop-types';
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

function CreatePitchDialog({
  open,
  handleClose,
  pitch,
  updatePitch,
  isCreate = true,
}) {
  const [formData, setFormData] = useState({
    id: pitch.id,
    name: pitch.name ?? '',
    description: pitch.description ?? '',
    team_id: pitch.id,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    if (isCreate) {
      const newPitch = await PitchesService.create(formData);
      updatePitch(newPitch.data);
    } else {
      await PitchesService.update(pitch.id, formData);
      updatePitch(formData);
    }
    handleClose();
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

CreatePitchDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  isCreate: PropTypes.bool.isRequired,
  pitch: PropTypes.object.isRequired,
  updatePitch: PropTypes.func.isRequired,
};

export default CreatePitchDialog;
