import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import GLOBALS from '../../../app_globals';
import { useMeeting } from '../../../hooks';
import { MeetingsService } from '../../../services';
import MeetingDetailsComments from './MeetingDetailsComments';
import MeetingDetailsCriterias from './MeetingDetailsCriterias';
import MeetingDetailsMembers from './MeetingDetailsMembers';
import MeetingDetailsPresentors from './MeetingDetailsPresentors';
import MeetingHistoryDialog from './MeetingHistoryDialog';

function MeetingDetailsPage() {
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { meetingId } = useParams();
  const { isLoading, meeting } = useMeeting(meetingId);
  const navigate = useNavigate();

  const tabOptions = [
    { value: 0, name: 'Pitch', stringValue: 'pitch' },
    { value: 1, name: 'Criteria', stringValue: 'criteria' },
    { value: 2, name: 'Comments', stringValue: 'comments' },
  ];

  const [meetingDetailsPageTabValue, setDetailsPageTabValue] = useState(
    Number(localStorage.getItem('meetingsDetailsageTabValue')) ?? 0
  );
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);

  const handleHistoryDialogOpen = async () => {
    setOpenHistoryDialog(true);
  };

  const handleHistoryDialogClose = () => {
    setOpenHistoryDialog(false);
  };

  const handleTabChange = (event, value) => {
    localStorage.setItem('meetingsDetailsageTabValue', value);
    setDetailsPageTabValue(value);
  };

  const handleStartClick = async () => {
    await MeetingsService.start(meetingId);
    navigate(`/classes/${classId}/teknoplat/live/${meetingId}`);
  };

  const handleJoinClick = async () => {
    navigate(`/classes/${classId}/teknoplat/live/${meetingId}`);
  };

  return (
    <Box p={3}>
      {!isLoading && (
        <>
          <Grid container spacing={2}>
            <Grid item sm={12} md={8}>
              <Stack spacing={3} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={5}>
                  <Typography variant="h5">{meeting.name}</Typography>
                  {meeting.status === 'pending' &&
                    classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER && (
                      <Button variant="contained" onClick={handleStartClick}>
                        Start
                      </Button>
                    )}
                  {meeting.status === 'in_progress' && (
                    <Button variant="contained" onClick={handleJoinClick}>
                      Join
                    </Button>
                  )}
                  {meeting.status === 'completed' && (
                    <Button
                      variant="contained"
                      onClick={handleHistoryDialogOpen}
                    >
                      View
                    </Button>
                  )}
                </Stack>
                <Typography fontWeight={100} variant="h6">
                  {meeting.description}
                </Typography>
              </Stack>
              <Tabs
                value={meetingDetailsPageTabValue}
                onChange={handleTabChange}
                aria-label="action-tabs"
              >
                {tabOptions.map((option) => (
                  <Tab
                    key={option.value}
                    id={`option-${option.value}`}
                    label={option.name}
                    aria-controls={`tabpanel-${option.value}`}
                  />
                ))}
              </Tabs>
              <Divider />
              {meetingDetailsPageTabValue === 0 && (
                <MeetingDetailsPresentors presentors={meeting.presentors} />
              )}
              {meetingDetailsPageTabValue === 1 && (
                <MeetingDetailsCriterias criterias={meeting.criterias} />
              )}
              {meetingDetailsPageTabValue === 2 && (
                <MeetingDetailsComments
                  user={user}
                  classMember={classMember}
                  comments={meeting.comments}
                />
              )}
            </Grid>
            <Grid item sm={12} md={4}>
              <MeetingDetailsMembers classId={classId} />
            </Grid>
          </Grid>
          <MeetingHistoryDialog
            open={openHistoryDialog}
            handleClose={handleHistoryDialogClose}
            presentors={meeting.presentors}
            title={meeting.name}
          />
        </>
      )}
    </Box>
  );
}

export default MeetingDetailsPage;
