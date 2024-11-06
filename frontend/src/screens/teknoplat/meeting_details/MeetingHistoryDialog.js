import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { useOutletContext, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useCriterias, useMeeting, useMeetingHistory } from '../../../hooks';
import GLOBALS from '../../../app_globals';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MeetingHistoryDialog({ title, presentors, open, handleClose }) {
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { meetingId } = useParams();
  const { isLoading, ratings, remarks, feedbacks } =
    useMeetingHistory(meetingId);
  const { isLoading: isMeetingLoading, meeting } = useMeeting(meetingId);
  const [pitches, setPitches] = useState([]);
  const { isLoading: isCriteriasLoading, criterias } = useCriterias();
  useEffect(() => {
    if (!isLoading) {
      const pitches = [];
      meeting.presentors.forEach((presentor) => {
        pitches.push(presentor.pitch);
      });

      setPitches(pitches);
    }
  }, [isMeetingLoading, meeting]);

  let tabOptions = [{ value: 0, name: 'Overall', id: null }];

  const tabPitchOptions = presentors.map((presentor, index) => ({
    value: index + 1,
    name: presentor.pitch.name,
    id: presentor.id,
    ratings: ratings?.filter(
      (rating) => rating.pitch_id === presentor.pitch_id
    ),
    feedbacks: feedbacks?.filter(
      (feedback) => feedback.pitch_id === presentor.pitch_id
    ),
    remarks: remarks?.filter(
      (remark) => remark.pitch_id === presentor.pitch_id
    ),
  }));

  tabOptions = tabOptions.concat(tabPitchOptions);

  const [dialogTabValue, setDialogTabValue] = useState(0);

  const handleTabChange = (event, value) => {
    setDialogTabValue(value);
  };

  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': {
          width: 'calc(100vw * .5)',
          height: 'calc(100vh * .7)',
        },
      }}
      maxWidth="sm"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
          {/* {classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER && <Button variant="contained" onClick={handleExportClick}>Export</Button>} */}
        </Stack>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
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
        <Tabs
          value={dialogTabValue}
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
        {isLoading ? (
          <Box />
        ) : (
          <Box>
            {dialogTabValue === 0 && (
              <OverallView
                pitches={pitches}
                ratings={ratings}
                meeting={meeting}
              />
            )}
            {dialogTabValue !== 0 && (
              <PitchView
                ratings={tabOptions[dialogTabValue].ratings}
                remarks={tabOptions[dialogTabValue].remarks}
                feedbacks={tabOptions[dialogTabValue].feedbacks}
                criterias={criterias}
              />
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

MeetingHistoryDialog.propTypes = {
  title: PropTypes.string.isRequired,
  presentors: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function OverallView({ pitches, ratings, meeting }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rating Summary',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const labels = pitches.map((pitch) => pitch.name);

  const overallScores = useMemo(() => {
    const criterias = meeting.criterias;
    const overallScores = pitches.map((pitch) => {
      const ratingsForPitch = ratings.filter(
        (rating) => rating.pitch_id === pitch.id
      );
      const totalScorePerCriterias = criterias.map((criteria) => {
        const weight = Number(criteria.weight);
        const ratingsForCriteria = ratingsForPitch.filter(
          (rating) => rating.meeting_criteria_id === criteria.criteria_id
        );
        const sumOfRatings = ratingsForCriteria.reduce((acc, rating) => {
          return acc + Number(rating.rating);
        }, 0);
        return sumOfRatings * weight;
      });

      const totalScore = totalScorePerCriterias.reduce((acc, score) => {
        return acc + score;
      }, 0);

      return totalScore / totalScorePerCriterias.length;
    });
    return overallScores;
  }, [pitches, ratings, meeting]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Overall Score',
        data: overallScores,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <Box p={3}>
      <Bar options={options} data={data} />
    </Box>
  );
}

OverallView.propTypes = {
  ratings: PropTypes.array.isRequired,
};

const colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'gray',
  'black',
];

function PitchView({ ratings, remarks, feedbacks, criterias }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Rating Summary',
      },
    },
  };
  const criteriaIds = [];
  ratings.forEach((rating) => {
    if (!criteriaIds.includes(rating.meeting_criteria_id)) {
      criteriaIds.push(rating.meeting_criteria_id);
    }
  });

  const labels = criteriaIds.map((id) => {
    const criteria = criterias.find((c) => c.id === id);
    return criteria.name;
  });

  const ratingsByCriteria = criteriaIds.map((id) => {
    const ratingsForCriteria = ratings.filter(
      (rating) => rating.meeting_criteria_id === id
    );
    const totalScore = ratingsForCriteria.reduce(
      (acc, rating) => acc + Number(rating.rating),
      0
    );
    return totalScore / ratingsForCriteria.length;
  });

  const data = {
    labels,
    datasets: [
      {
        data: ratingsByCriteria,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <Box p={3}>
      <Stack spacing={2}>
        <Bar options={options} data={data} />
        <Typography variant="h6">User Remarks</Typography>
        {remarks.map((rmk) => (
          <Paper sx={{ p: 3 }}>
            <Typography>{rmk.remark}</Typography>
          </Paper>
        ))}
        <Typography variant="h6">Summary of Remarks</Typography>
        <Paper sx={{ p: 3 }}>
          {feedbacks.map((feedback) => (
            <Typography variant="body1" textAlign="justify">
              {feedback.feedback}
            </Typography>
          ))}
        </Paper>
      </Stack>
    </Box>
  );
}

export default MeetingHistoryDialog;
