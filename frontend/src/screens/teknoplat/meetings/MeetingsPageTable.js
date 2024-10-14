import {
  Box,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMeetings } from '../../../hooks';
import GLOBALS from '../../../app_globals';

function MeetingsPageTable({ classroomId, status, search }) {
  const navigate = useNavigate();
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { isLoading, meetings } = useMeetings(classroomId, status);

  const handleMeetingClick = (meeting) => {
    localStorage.setItem('meeting', meeting.id);
    localStorage.setItem('meeting_link_name', meeting.name);
    localStorage.setItem('videoId', meeting.video);
    navigate(`/classes/${classroomId}/teknoplat/meetings/${meeting.id}`);
  };

  let renderedMeetings = meetings;

  if (classMember.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT) {
    renderedMeetings = meetings.filter((meeting) => {
      return meeting.presentors.some((presentor) => {
        return presentor.members.some((member) => member.id === user.user_id);
      });
    });
  }

  return (
    <Box p={5}>
      <Paper>
        <TableContainer
          sx={{
            height: 'calc(100vh - 64px - 48px - 49px - 80px - 52px - 107px)',
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
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 'calc(100% * 0.09)', opacity: 0.9 }} />
                <TableCell sx={{ opacity: 0.9 }}>Title</TableCell>
                <TableCell sx={{ width: 'calc(100% * 0.2)', opacity: 0.9 }}>
                  Teacher Score Weight
                </TableCell>
                <TableCell sx={{ width: 'calc(100% * 0.2)', opacity: 0.9 }}>
                  Student Score Weight
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell>
                    <Skeleton variant="rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" />
                  </TableCell>
                </TableRow>
              ) : (
                renderedMeetings
                  .filter((meeting) =>
                    meeting.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleMeetingClick(meeting)}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>{meeting.name}</TableCell>
                      <TableCell>{`${meeting.teacher_weight_score * 100}%`}</TableCell>
                      <TableCell>{`${meeting.student_weight_score * 100}%`}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

// MeetingsPageTable.propTypes = {
//   classroomId: PropTypes.number.isRequired,
//   status: PropTypes.string.isRequired,
//   search: PropTypes.string.isRequired,
// };

export default MeetingsPageTable;
