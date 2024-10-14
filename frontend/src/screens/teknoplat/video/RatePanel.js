import { Button, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import GLOBALS from '../../../app_globals';
import { useTeam } from '../../../hooks';
import RateDialog from './RateDialog';
import { MeetingsService } from '../../../services';

function RatePanel() {
  // const { enqueueSnackbar } = useSnackbar();
  const { user, classId, classRoom, classMember } = useOutletContext();
  const params = useParams();

  const [presentors, setPresentors] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const meetingId = params.meetingId;
      const res = await MeetingsService.get(meetingId);
      const meeting = res.data;
      setPresentors(meeting.presentors);
    }, 1000);
    return () => clearTimeout(interval);
  }, [params.meetingId]);

  const [socket, setSocket] = useState(null);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [selectedPresentor, setSelectedPresentor] = useState(null);
  const [criterias, setCriterias] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await MeetingsService.get(params.meetingId);
      const meeting = res.data;
      setCriterias(meeting.criterias);
    })();
  }, []);
  const handleRateDialogOpen = () => {
    setOpenRateDialog(true);
  };

  const handleRateDialogClose = () => {
    setOpenRateDialog(false);
  };

  const handleChangeSelectedPresentor = (presentor) => {
    setSelectedPresentor(presentor);
  };

  return (
    <Paper
      sx={{
        p: 2,
        height: 'calc(100vh - 72px - 48px - 24px - 66px - 190px)',
        width: '360px',
      }}
    >
      <Stack spacing={1}>
        {presentors
          .filter((presentor) => presentor.pitch.team_id != null)
          .map((presentor) => (
            <PresentorPaper
              key={presentor.id}
              presentor={presentor}
              isStudent={classMember.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT}
              handleOpen={handleRateDialogOpen}
              selectPresentor={handleChangeSelectedPresentor}
            />
          ))}
      </Stack>
      <RateDialog
        key={selectedPresentor}
        open={openRateDialog}
        handleClose={handleRateDialogClose}
        criterias={criterias}
        selectedPresentor={selectedPresentor}
        classMember={classMember}
      />
    </Paper>
  );
}

RatePanel.propTypes = {
  presentors: PropTypes.array.isRequired,
};

function PresentorPaper({ presentor, isStudent, handleOpen, selectPresentor }) {
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { isRetrieving, teamMembers } = useTeam(
    classId,
    presentor.pitch.team_id
  );
  const { meetingId } = useParams();

  const isOpen = presentor.is_rate_open;

  const handleOpenRateClick = async () => {
    try {
      await MeetingsService.updateOpenPresentorRating(meetingId, {
        presentor: presentor.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRateClick = () => {
    selectPresentor(presentor);
    handleOpen();
  };

  if (isRetrieving) {
    return (
      <Paper elevaltion={4} sx={{ p: 1, pl: 2 }}>
        <Typography>{presentor.pitch.name}</Typography>
      </Paper>
    );
  }

  const isMember = teamMembers.find(
    (member) => member.class_member_id === classMember.id
  );

  return (
    <Paper elevation={4} sx={{ p: 1, pl: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography>{presentor.pitch.name}</Typography>
        {isMember && <Button disabled>Rate</Button>}
        {isStudent && !isOpen && !isMember && <Button disabled>Rate</Button>}
        {isStudent && isOpen && !isMember && (
          <Button onClick={handleRateClick}>Rate</Button>
        )}
        {!isStudent && isOpen && !isMember && (
          <Button onClick={handleRateClick}>Rate</Button>
        )}
        {!isStudent && !isOpen && !isMember && (
          <Button onClick={handleOpenRateClick}>Open</Button>
        )}
      </Stack>
    </Paper>
  );
}

PresentorPaper.propTypes = {
  presentor: PropTypes.object.isRequired,
  isStudent: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  selectPresentor: PropTypes.func.isRequired,
};

export default RatePanel;
