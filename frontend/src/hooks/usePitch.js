import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService, PitchesService } from '../services';

const usePitch = (classId) => {
  const navigate = useNavigate();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [pitch, setPitch] = useState(null);

  useEffect(() => {
    const getTeam = async () => {
      let responseCode;
      let retrievedTeam;

      try {
        const res = await ClassRoomsService.myTeam();

        responseCode = res?.status;
        retrievedTeam = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          return retrievedTeam.id;
        case 404:
          navigate(`/classes/${classId}/teams`);
          break;
        case 500:
          navigate('/classes');
          break;
        default:
      }
    };

    const getPitch = async (team_id) => {
      let responseCode;
      let retrievedPitch;

      try {
        const res = await PitchesService.getTeamPitch(team_id);

        responseCode = res?.status;
        retrievedPitch = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setPitch(retrievedPitch);
          break;
        case 404:
          navigate(`/classes/${classId}/teams`);
          break;
        case 500:
          navigate('/classes');
          break;
        default:
      }
    };

    const teamid = getTeam();
    getPitch(teamid);
    setIsRetrieving(false);
  }, []);

  return { isRetrieving, pitch };
};

export default usePitch;
