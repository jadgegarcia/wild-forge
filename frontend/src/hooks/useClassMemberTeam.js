import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';

const useClassMemberTeam = (classId, userId) => {
  const navigate = useNavigate();
  const [currentTeamMember, setCurrentTeamMember] = useState(null);
  const [team, setTeam] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(false);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedCurrentTeamMember;
      let retrievedTeam;

      try {
        const res = await ClassRoomsService.classMemberTeam(classId, userId);

        responseCode = res?.status;
        retrievedCurrentTeamMember = res?.data[0];
        retrievedTeam = res?.data[1];
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setCurrentTeamMember(retrievedCurrentTeamMember);
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

      setIsRetrieving(false);
    };

    get();
  }, []);

  return { isRetrieving, currentTeamMember, team };
};

export default useClassMemberTeam;
