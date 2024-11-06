import { Box, Button, Stack, Tab, Tabs, TextField } from '@mui/material';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import MeetingsPageTable from './MeetingsPageTable';
import CreateMeetingDialog from './CreateMeetingDialog';
import GLOBALS from '../../../app_globals';
import MeetingsPageTeam from '../meeting_details/MeetingsPageTeam';
import ChatbotPage from '../chatbot/ChatbotPage';

function MeetingsPage() {
  const { user, classId, classRoom, classMember } = useOutletContext();

  const tabOptions = [
    { value: 0, name: 'Pending', stringValue: 'pending' },
    { value: 1, name: 'In Progress', stringValue: 'in_progress' },
    { value: 2, name: 'Completed', stringValue: 'completed' },
    { value: 3, name: 'My Team', stringValue: 'my_team', teacherName: 'Teams' },
    { value: 4, name: 'Chatbot', stringValue: 'chatbot' },
  ];

  const [meetingsPageTabValue, setMeetingsPageTabValue] = useState(
    Number(localStorage.getItem('meetingsPageTabValue')) ?? 1
  );
  const [searchMeeting, setSearchMeeting] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createCounter, setCreateCounter] = useState(0);

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setCreateCounter(createCounter + 1);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleTabChange = (event, value) => {
    localStorage.setItem('meetingsPageTabValue', value);
    setMeetingsPageTabValue(value);
  };

  const handleSearchInput = (event) => {
    setSearchMeeting(event.target.value);
  };

  return (
    <Box p={3}>
      <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={meetingsPageTabValue}
          onChange={handleTabChange}
          aria-label="Status Tabs with additional Data"
        >
          {tabOptions.map((option) => (
            <Tab
              key={option.value}
              id={`status-option-${option.value}`}
              label={
                option.teacherName
                  ? classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER
                    ? option.teacherName
                    : option.name
                  : option.name
              }
              aria-controls={`status-tabpanel-${option.value}`}
            />
          ))}
        </Tabs>
        {meetingsPageTabValue >= 0 && meetingsPageTabValue < 3 && (
          <Stack direction="row" spacing={2} alignItems="center" ml="auto">
            {classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleOpenCreateDialog}
              >
                Create
              </Button>
            )}
            <TextField
              id="searchMeetingName"
              name="searchMeetingName"
              value={searchMeeting}
              label="Search Meetings"
              onChange={handleSearchInput}
              autoComplete="off"
              variant="outlined"
              size="small"
            />
          </Stack>
        )}
        {classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER && (
          <CreateMeetingDialog
            open={openCreateDialog}
            handleClose={handleCloseCreateDialog}
            status={
              tabOptions.find((option) => option.value === meetingsPageTabValue)
                .stringValue
            }
          />
        )}
      </Stack>
      {meetingsPageTabValue === 0 && (
        <MeetingsPageTable
          key={createCounter}
          classroomId={classId}
          search={searchMeeting}
          status={
            tabOptions.find((option) => option.value === meetingsPageTabValue)
              .stringValue
          }
        />
      )}
      {meetingsPageTabValue === 1 && (
        <MeetingsPageTable
          classroomId={classId}
          search={searchMeeting}
          status={
            tabOptions.find((option) => option.value === meetingsPageTabValue)
              .stringValue
          }
        />
      )}
      {meetingsPageTabValue === 2 && (
        <MeetingsPageTable
          classroomId={classId}
          search={searchMeeting}
          status={
            tabOptions.find((option) => option.value === meetingsPageTabValue)
              .stringValue
          }
        />
      )}
      {meetingsPageTabValue === 3 && <MeetingsPageTeam />}
      {meetingsPageTabValue === 4 && <ChatbotPage />}
    </Box>
  );
}

export default MeetingsPage;
