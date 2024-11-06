import { Box } from '@mui/material';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useMeeting } from '../../../hooks';
import VideoView from './VideoView';

function VideoPage() {
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { isLoading, meeting } = useMeeting(meetingId);
  const videoAccessToken = '';
  useEffect(() => {
    // if (!isLoading && !meeting.video)
    //   navigate(`/classes/${classId}/teknoplat/meetings/${meetingId}`);
  }, [isLoading]);

  if (isLoading) {
    return <Box />;
  }

  return (
    <Box height="calc( 100vh - 66px - 190px )">
      <MeetingProvider
        config={{
          meetingId: meeting.video,
          micEnabled: meeting.owner_id === classMember.id,
          webcamEnabled: meeting.owner_id === classMember.id,
          name: `${user.first_name} ${user.last_name}`,
          participantId: classMember.id,
        }}
        token={meeting.token}
      >
        <VideoView meeting={meeting} classMember={classMember} />
      </MeetingProvider>
    </Box>
  );
}

export default VideoPage;
