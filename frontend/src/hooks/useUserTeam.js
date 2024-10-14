import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';

const useUserTeam = (classId, teamId) => {
  const navigate = useNavigate();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const get = async () => {
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

    get();
    setIsRetrieving(false);
  }, []);

  return { isRetrieving, team };
};

export default useUserTeam;
