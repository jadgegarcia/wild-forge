import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MeetingsService,
  RatingsService,
  RemarksService,
} from '../../../services';

function RateDialog({
  open,
  handleClose,
  criterias,
  selectedPresentor,
  classMember,
}) {
  const { meetingId } = useParams();
  const initialRateData = {};
  criterias.forEach((criteria) => {
    initialRateData[criteria.criteria.name] = 0;
  });

  const [pitch, setPitch] = useState({});
  const [ratingsData, setRatingsData] = useState(initialRateData);
  const [ratingsId, setRatingsId] = useState(null);
  const [remark, setRemark] = useState('');
  const [remarkId, setRemarkId] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const fillData = async (pitchId) => {
    const ratingsResponse = await RatingsService.getAccountRatingsForPresentor(
      meetingId,
      pitchId
    );
    if (ratingsResponse.data.length !== 0) {
      const ratings = ratingsResponse.data;
      const updatedRateData = {};
      const ids = {};
      criterias.forEach((criteria) => {
        updatedRateData[criteria.criteria.name] = Number(
          ratings.find(
            (rating) => rating.meeting_criteria_id === criteria.criteria_id
          ).rating
        );
        ids[criteria.criteria.name] = ratings.find(
          (rating) => rating.meeting_criteria_id === criteria.criteria_id
        ).id;
      });
      setRatingsData(updatedRateData);
      setRatingsId(ids);
      setIsUpdate(true);
    }
    const remarkResponse = await RemarksService.getAccountRemarksForPresentor(
      meetingId,
      pitchId
    );
    if (remarkResponse.data.length !== 0) {
      setRemark(remarkResponse.data[0].remark);
      setRemarkId(remarkResponse.data[0].id);
    }
  };

  useEffect(() => {
    if (open) {
      setPitch(selectedPresentor);
      fillData(selectedPresentor.pitch_id);
    } else {
      setRatingsData(initialRateData);
      setRemark('');
    }
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    let isNotZero = true;

    criterias.forEach((criteria) => {
      if (!isNotZero) return;
      isNotZero = ratingsData[criteria.criteria.name] !== 0;
    });
    setIsComplete(isNotZero && remark !== '');
    // eslint-disable-next-line
  }, [ratingsData, remark]);

  const handleRatingChange = (e, newValue) => {
    const { name } = e.target;
    if (newValue === null) return;
    setRatingsData((previousData) => ({
      ...previousData,
      [name]: newValue,
    }));
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleSaveClick = async () => {
    setIsComplete(false);
    const ratingsPayload = criterias.map((criteria) => ({
      rating: ratingsData[criteria.criteria.name],
      classmember_id: classMember.id,
      pitch_id: selectedPresentor.pitch_id,
      meeting_criteria_id: criteria.criteria_id,
    }));

    const remarkPayload = {
      remark,
      classmember_id: classMember.id,
      pitch_id: selectedPresentor.pitch_id,
    };

    ratingsPayload.map(async (payload) => {
      try {
        if (isUpdate) {
          const id =
            ratingsId[
              criterias.find(
                (criteria) =>
                  payload.meeting_criteria_id === criteria.criteria_id
              ).name
            ];
          payload.id = id;
          await MeetingsService.updateRatingToPresentor(meetingId, payload);
        } else {
          await MeetingsService.addRatingToPresentor(meetingId, payload);
        }
      } catch (err) {
        console.error(err);
      }
    });

    try {
      if (isUpdate) {
        remarkPayload.id = remarkId;
        await MeetingsService.updateRemarkToPresentor(meetingId, remarkPayload);
      } else {
        await MeetingsService.addRemarkToPresentor(meetingId, remarkPayload);
      }
    } catch (err) {
      console.error(err);
    }
    handleClose();
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', height: '70%' } }}
      maxWidth="sm"
      open={open}
    >
      <DialogTitle>{pitch?.name}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Rating</Typography>
        <Stack spacing={2} py={2}>
          {criterias.map((criteria) => (
            <Stack
              key={criteria.id}
              direction="row"
              justifyContent="space-between"
            >
              <Typography>{criteria.criteria.name}</Typography>
              <Stack direction="row" spacing={1}>
                <Rating
                  name={criteria.criteria.name}
                  precision={0.2}
                  value={ratingsData[criteria.criteria.name]}
                  onChange={handleRatingChange}
                  size="large"
                />
                <Typography>
                  {ratingsData[criteria.criteria.name] % 1 === 0
                    ? `${ratingsData[criteria.criteria.name]}.0`
                    : ratingsData[criteria.criteria.name]}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Remarks
        </Typography>
        <TextField
          value={remark}
          onChange={handleRemarkChange}
          fullWidth
          multiline
          rows={5}
          label="Write your remark/feedback"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleSaveClick} disabled={!isComplete}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  criterias: PropTypes.array.isRequired,
  selectedPresentor: PropTypes.object.isRequired,
  classMember: PropTypes.object.isRequired,
};

export default RateDialog;
