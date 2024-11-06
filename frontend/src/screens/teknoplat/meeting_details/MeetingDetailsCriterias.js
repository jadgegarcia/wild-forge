import React from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

function MeetingDetailsCriterias({ criterias }) {
  /* eslint-disable react/prop-types */
  return (
    <Box p={3}>
      {criterias.map((criteria) => (
        <Accordion key={criteria.id}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`${criteria.criteria.name}-content`}
            id={`${criteria.criteria.name}-header`}
          >
            <Typography>{`${criteria.criteria.name} - ${criteria.weight * 100}%`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ mb: 2 }}>
              {criteria.criteria.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

MeetingDetailsCriterias.propTypes = {
  criterias: PropTypes.array.isRequired,
};

export default MeetingDetailsCriterias;
