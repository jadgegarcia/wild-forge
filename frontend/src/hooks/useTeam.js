import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';

const useTeam = (classId, teamId) => {
  const navigate = useNavigate();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedTeam;

      try {
        const res = await ClassRoomsService.team(classId, teamId);

        responseCode = res?.status;
        retrievedTeam = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setTeam(retrievedTeam);
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

    const getTeamMembers = async () => {
      let responseCode;
      let retrievedMembers;

      try {
        const res = await ClassRoomsService.teamMembers(classId, teamId);
        responseCode = res?.status;
        retrievedMembers = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setTeamMembers(retrievedMembers);
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

    get();
    getTeamMembers();
    setIsRetrieving(false);
  }, []);

  return { isRetrieving, team, teamMembers };
};

export default useTeam;
