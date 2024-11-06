import { Box, Collapse, Paper, Stack } from '@mui/material';
import { useMeeting } from '@videosdk.live/react-sdk';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import ParticipantPanel from './ParticipantPanel';
import ParticipantControls from './ParticipantControls';
import RatePanel from './RatePanel';
import CommentPanel from './CommentPanel';
import ParticipantView from './ParticipantView';
import { useOutletContext } from 'react-router-dom';
import GLOBALS from '../../../app_globals';

function VideoView({ meeting, classMember }) {
  const { join, participants, enableWebcam, unmuteMic, localWebcamOn } =
    useMeeting({
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
  const [load, setLoad] = useState(true);
  const [collapse, setCollapse] = useState(true);
  const [collapseHidden, setCollapseHidden] = useState(false);
  const [optionTabValue, setOptionTabValue] = useState(-1);
  const webcamStatusIntentionRef = useRef(true);

  useEffect(() => {
    if (load) {
      setLoad(false);
    } else {
      join();
    }
    // eslint-disable-next-line
  }, [load]);

  useEffect(() => {
    if (optionTabValue !== -1) {
      setCollapse(true);
      setCollapseHidden(true);
    } else {
      setCollapse(true);
      setCollapseHidden(true);
    }
  }, [optionTabValue]);

  const handleControlTabChange = (index) => {
    setOptionTabValue(index);
  };

  return (
    <Box height="calc( 100vh - 66px - 190px )" p={3}>
      <Stack
        height="calc(100vh - 72px - 48px - 66px - 190px)"
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Box flexGrow={1}>
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </Box>
        <Box>
          <Collapse in={collapse} orientation="horizontal">
            {optionTabValue === -1 && (
              <Paper
                sx={{
                  width: '360px',
                  height: 'calc(100vh - 48px - 72px - 24px  - 66px - 190px )',
                }}
              />
            )}
            {optionTabValue === 0 && (
              <RatePanel presentors={meeting.presentors} />
            )}
            {optionTabValue === 1 && <ParticipantPanel meeting={meeting} />}
            {optionTabValue === 2 && <CommentPanel />}
            {optionTabValue == null && <CommentPanel />}
          </Collapse>
        </Box>
      </Stack>
      <ParticipantControls
        controlTab={optionTabValue}
        changeTab={handleControlTabChange}
        classMember={classMember}
        meeting={meeting}
        webcamStatusRef={webcamStatusIntentionRef}
      />
    </Box>
  );
}

VideoView.propTypes = {
  meeting: PropTypes.object.isRequired,
  classMember: PropTypes.object.isRequired,
};

export default VideoView;
