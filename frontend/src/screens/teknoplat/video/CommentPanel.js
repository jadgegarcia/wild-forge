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
import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { MeetingsService } from '../../../services';
import CommentsService from '../../../services/CommentsService';

function CommentPanel({}) {
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { meetingId } = useParams();
  const scrollableBoxRef = useRef(null);

  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await CommentsService.all(meetingId);
      const comments = res.data;
      setCommentList(comments);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
  }, [commentList]);

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleCommentClick = async (e) => {
    await MeetingsService.addMeetingComment(meetingId, {
      comment,
      classmember_id: classMember.id,
    });
    setComment('');
  };

  return (
    <Paper
      sx={{
        height: 'calc(100vh - 72px - 48px - 24px - 66px - 190px)',
        width: '360px',
      }}
    >
      <Box
        ref={scrollableBoxRef}
        sx={{
          height: 'calc(100vh - 72px - 72px - 48px - 24px - 66px - 190px)',
          maxHeight: 'calc(100vh - 72px - 72px - 48px - 24px - 66px - 190px)',
          width: '360px',
          px: 1,
          py: 2,
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
      <Box sx={{ width: '100%', p: 2 }}>
        <Stack direction="row" spacing={1}>
          <TextField
            value={comment}
            name="comment"
            onChange={handleCommentChange}
            fullWidth
            size="small"
            label="Write a comment..."
          />
          {/* <TextField value={profile.id} name="account" type="hidden" /> */}
          <Button size="small" variant="contained" onClick={handleCommentClick}>
            <Send />
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

CommentPanel.propTypes = {};

export default CommentPanel;
