import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useOutletContext, useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { Edit, ExpandMore } from '@mui/icons-material';
import MeetingsPageCreatePitch from './MeetingsPageCreatePitch';
import { MeetingsService, TeamService } from '../../../services';
import GLOBALS from '../../../app_globals';

export default function MeetingsPageTeam() {
  const { user, classId, classRoom, classMember } = useOutletContext();
  const { courseId } = useParams();

  const [teams, setTeams] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const getTeams = async () => {
    try {
      const res = await MeetingsService.all(classId, 'all');
      const meetings = res.data;
      const presentors = [];
      meetings.forEach((meeting) => {
        if (meeting.presentors.length === 0) return;
        meeting.presentors.forEach((presentor) => {
          if (presentors.find((p) => p.id === presentor.id)) return;
          presentors.push(presentor);
        });
      });
      const teams = [];
      presentors.forEach((presentor) => {
        const team = {
          id: presentor.team.id,
          name: presentor.team.name,
          description: presentor.team.description,
          pitch: presentor.pitch,
          members: presentor.members,
          presentorId: presentor.id,
        };
        teams.push(team);
      });
      const filteredTeams = teams.filter((team) => {
        if (classMember.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT) {
          return team.members.some((member) => member.id === user.user_id);
        } else {
          return true;
        }
      });
      console.log({ meetings, presentors, teams });
      setTeams(filteredTeams);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    setLoading(true);
    getTeams();
  }, [courseId]);

  useEffect(() => {
    if (teams !== null) {
      setLoading(false);
    }
  }, [teams]);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const updateTeam = (pitch) => {
    const newTeamData = teams.map((team) => {
      if (team.id === pitch.team) {
        return {
          ...team,
          pitch: pitch,
        };
      }
      return team;
    });
    setTeams(newTeamData);
  };

  return (
    <Box p={5}>
      {loading
        ? [0, 1, 2, 3, 4, 5].map((item) => (
            <Accordion key={item}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${item}-content`}
                id={`${item}-header`}
              >
                <Skeleton animation="wave" variant="text" />
              </AccordionSummary>
              <AccordionDetails>
                <Skeleton animation="wave" variant="text" />
              </AccordionDetails>
            </Accordion>
          ))
        : teams.map((team) => (
            <Accordion key={team.id}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${team.name}-content`}
                id={`${team.name}-header`}
              >
                <Typography>{`${team.name} ${team.pitch ? `- ${team.pitch.name}` : ''}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item md={5} sm={12}>
                    <Stack spacing={2}>
                      <Typography>{team.name}</Typography>
                      <Typography>{team.description}</Typography>
                      <Typography>
                        Members:
                        {team.members.map((member, index) => (
                          <span key={member.id}>
                            <span> </span>
                            {member.first_name} {member.last_name}
                            {index !== team.members.length - 1 && (
                              <span>,</span>
                            )}
                          </span>
                        ))}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item md={1} sm={12}>
                    <Divider
                      orientation="vertical"
                      sx={{ display: { md: 'block', sm: 'none' } }}
                    />
                    <Divider sx={{ display: { md: 'none', sm: 'block' } }} />
                  </Grid>
                  <Grid item md={6} sm={12}>
                    {team?.pitch?.name ? (
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography>{team.pitch.name}</Typography>
                          {classMember.role ===
                            GLOBALS.CLASSMEMBER_ROLE.STUDENT && (
                            <IconButton size="small" onClick={handleDialogOpen}>
                              <Edit fontSize="inherit" />
                            </IconButton>
                          )}
                        </Stack>
                        <Typography>{team.pitch.description}</Typography>
                        {classMember.role ===
                          GLOBALS.CLASSMEMBER_ROLE.STUDENT && (
                          <MeetingsPageCreatePitch
                            key={team.pitch.id}
                            open={openDialog}
                            handleClose={handleDialogClose}
                            team={team}
                            updateTeam={updateTeam}
                            isCreate={false}
                          />
                        )}
                      </Stack>
                    ) : (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        {classMember.role ===
                        GLOBALS.CLASSMEMBER_ROLE.TEACHER ? (
                          <Typography>No Pitch</Typography>
                        ) : (
                          <Fragment>
                            <Button
                              variant="contained"
                              onClick={handleDialogOpen}
                            >
                              Create Pitch
                            </Button>
                            <MeetingsPageCreatePitch
                              open={openDialog}
                              handleClose={handleDialogClose}
                              team={team}
                              updateTeam={updateTeam}
                            />
                          </Fragment>
                        )}
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
    </Box>
  );
}
