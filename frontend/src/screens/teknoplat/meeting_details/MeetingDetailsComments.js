import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { MeetingsService } from '../../../services';

function MeetingDetailsComments({ user, classMember, comments }) {
  /* eslint-disable react/prop-types */
  const { meetingId } = useParams();
  const scrollableBoxRef = useRef(null);

  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState(comments);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!meetingId) return;
      const res = await MeetingsService.get(meetingId);
      const meeting = res.data;
      setCommentList(meeting.comments);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [meetingId]);

  useEffect(() => {
    scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
  }, [commentList]);

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleCommentClick = async (e) => {
    setCommentList((previous) => [
      ...previous,
      {
        comment,
        classmember_id: classMember.id,
        full_name: `${user.first_name} ${user.last_name}`,
      },
    ]);
    await MeetingsService.addMeetingComment(meetingId, {
      comment,
      classmember_id: classMember.id,
    });
    setComment('');
  };

  return (
    <Box pt={3} pl={3} pr={3}>
      <Paper
        sx={{
          height: 'calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 147px)',
          p: 1,
          position: 'relative',
          minHeight: '500px',
        }}
      >
        <Box
          ref={scrollableBoxRef}
          sx={{
            maxHeight:
              'calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 72px - 147px)',
            minHeight: 'calc(500px - 72px)',
            px: 1,
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
          <Stack spacing={2}>
            {commentList.map((commentData) => (
              <Paper
                key={commentData.id}
                sx={{
                  backgroundColor: '#f3f3f3',
                  width: 'fit-content',
                  maxWidth: '80%',
                  p: 1,
                  marginLeft:
                    classMember.id === commentData.classmember_id
                      ? 'auto !important'
                      : '',
                }}
              >
                <Stack direction="row" spacing={1}>
                  <img
                    src="/assets/default_avatar.png"
                    alt="AccountProfile"
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '5px',
                      borderRadius: '5px',
                    }}
                  />
                  <Stack spacing={0}>
                    <Typography variant="body1" fontSize={14} color="grey">
                      {commentData.full_name}
                    </Typography>
                    <Typography variant="body1" fontSize={14}>
                      {commentData.comment}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
        <Paper
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            p: 2,
          }}
        >
          <Stack direction="row" spacing={1}>
            <TextField
              value={comment}
              name="comment"
              onChange={handleCommentChange}
              fullWidth
              size="small"
              label="Write a comment..."
            />
            <Button
              size="small"
              variant="contained"
              onClick={handleCommentClick}
            >
              <Send />
            </Button>
          </Stack>
        </Paper>
      </Paper>
    </Box>
  );
}

MeetingDetailsComments.propTypes = {
  user: PropTypes.object.isRequired,
  classMember: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
};

export default MeetingDetailsComments;
