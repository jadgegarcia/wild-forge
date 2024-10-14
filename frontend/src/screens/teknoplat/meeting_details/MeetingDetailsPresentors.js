import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTeam } from '../../../hooks';
import { useEffect, useState } from 'react';
import { ClassRoomsService } from '../../../services';
import { useOutletContext } from 'react-router-dom';

function MeetingDetailsPresentors({ presentors }) {
  const { classId } = useOutletContext();
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    (async () => {
      presentors.forEach(async (presentor) => {
        const res = await ClassRoomsService.team(classId, presentor.team_id);
        const team = res.data;
        setTeams((prevTeam) => [...prevTeam, team]);
      });
    })();
  }, [presentors]);

  return (
    <Box p={3}>
      {teams.map((team, idx) => (
        <Accordion key={team.id}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`${team.name}-content`}
            id={`${team.name}-header`}
          >
            <Typography>{`${team.name} ${presentors[idx]?.pitch?.name && `- ${presentors[idx].pitch.name}`}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {presentors[idx]?.pitch?.description && (
              <Typography>{presentors[idx].pitch.description}</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

MeetingDetailsPresentors.propTypes = {
  presentors: PropTypes.array.isRequired,
};

export default MeetingDetailsPresentors;
