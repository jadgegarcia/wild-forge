import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
} from '@mui/material';
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useClassMembers } from '../../../hooks';
import GLOBALS from '../../../app_globals';

function ParticipantPanel({ meeting }) {
  const { participants } = useMeeting();
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { isRetrieving, classMembers } = useClassMembers(classId);

  const [inMeeting, setInMeeting] = useState([]);
  const [notInMeeting, setNotInMeeting] = useState([]);

  useEffect(() => {
    if (!isRetrieving && classMembers.length > 0) {
      const inMeetingList = Array.from(participants.keys()).map(
        (participant) => ({
          participantId: participant,
          ...classMembers.find((member) => member.id == participant),
        })
      );
      const notInMeetingList = classMembers.filter(
        (member) =>
          !inMeetingList.find((meetingMember) => member.id == meetingMember.id)
      );
      setInMeeting(inMeetingList);
      setNotInMeeting(notInMeetingList);
    }
  }, [isRetrieving, classMembers]);

  return (
    <Paper
      sx={{
        height: 'calc(100vh - 72px - 48px - 24px - 66px - 190px)',
        width: '360px',
      }}
    >
      <List
        sx={{
          py: 0,
          height: '100%',
          overflowY: 'hidden',
          ':hover': {
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: (theme) => theme.palette.primary.main,
              borderRadius: '2.5px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: (theme) => theme.palette.background.paper,
            },
          },
        }}
      >
        <ListSubheader
          sx={{ backgroundColor: 'inherit', position: 'relative' }}
        >
          Teachers
        </ListSubheader>
        {inMeeting
          .filter((member) => member.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER)
          .map((teacher) => {
            if (meeting.owner === teacher.id) {
              return (
                <Participant
                  key={teacher.id}
                  participant={teacher}
                  isNotHost={false}
                  isOwner={classMember.id === meeting.owner_id}
                />
              );
            }
            return (
              <Participant
                key={teacher.id}
                participant={teacher}
                isNotHost
                isOwner={classMember.id === meeting.owner_id}
              />
            );
          })}
        <ListSubheader sx={{ backgroundColor: 'inherit' }}>
          Students
        </ListSubheader>
        {inMeeting
          .filter((member) => member.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT)
          .map((student) => (
            <Participant
              key={student.id}
              participant={student}
              isNotHost
              isOwner={classMember.id === meeting.owner_id}
            />
          ))}
        <ListSubheader sx={{ backgroundColor: 'inherit' }}>
          Not In Meeting
        </ListSubheader>
        {notInMeeting.map((member) => (
          <ListItem key={member.id} disablePadding>
            <ListItemButton
              disabled
              sx={{
                opacity: '1 !important',
                userSelect: 'text',
                cursor: 'text !important',
                pointerEvents: 'auto',
              }}
            >
              <ListItemText
                primary={`${member.first_name} ${member.last_name}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

ParticipantPanel.propTypes = {
  meeting: PropTypes.object.isRequired,
};

function Participant({ participant, isNotHost, isOwner }) {
  const {
    enableWebcam: remoteEnableWebcam,
    disableWebcam: remoteDisableWebcam,
    enableMic,
    disableMic: remoteDisableMic,
    webcamOn,
    micOn,
    displayName,
  } = useParticipant(participant.participantId);
  const {
    enableWebcam: localEnableWebcam,
    disableWebcam: localDisableWebcam,
    unmuteMic,
    muteMic,
  } = useMeeting({
    onWebcamRequested: ({ accept, reject, participantId }) => {
      // callback function to accept the request
      // how to get the webcam option and let user choose
      accept();
    },
    onMicRequested: ({ accept, reject, participantId }) => {
      // callback function to accept the request
      accept();
    },
  });

  const handleToggleParticipantWebCam = () => {
    if (webcamOn) {
      remoteDisableWebcam();
      setTimeout(() => {
        localEnableWebcam();
      }, 500);
    } else {
      localDisableWebcam();
      setTimeout(() => {
        remoteEnableWebcam();
      }, 500);
    }
  };

  const handleToggleParticipantMic = () => {
    if (micOn) {
      remoteDisableMic();
      setTimeout(() => {
        unmuteMic();
      }, 500);
    } else {
      muteMic();
      setTimeout(() => {
        enableMic();
      }, 500);
    }
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        isNotHost &&
        isOwner && (
          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="toggleMic"
              onClick={handleToggleParticipantMic}
            >
              {micOn ? <Mic /> : <MicOff />}
            </IconButton>
            <IconButton
              aria-label="toggleVideo"
              onClick={handleToggleParticipantWebCam}
            >
              {webcamOn ? <Videocam /> : <VideocamOff />}
            </IconButton>
          </Stack>
        )
      }
    >
      <ListItemButton
        disabled
        sx={{
          opacity: '1 !important',
          userSelect: 'text',
          cursor: 'text !important',
          pointerEvents: 'auto',
        }}
      >
        <ListItemText
          primary={`${participant.first_name} ${participant.last_name}`}
        />
      </ListItemButton>
    </ListItem>
  );
}

Participant.propTypes = {
  participant: PropTypes.object.isRequired,
  isNotHost: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default ParticipantPanel;
