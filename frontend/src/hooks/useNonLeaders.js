import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';
import GLOBALS from '../app_globals';

const useNonLeaders = (classId) => {
  const navigate = useNavigate();
  const [nonLeaders, setNonLeaders] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(true);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedNonleaders;

      try {
        const res = await ClassRoomsService.nonleaders(classId);

        responseCode = res?.status;
        retrievedNonleaders = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setNonLeaders(retrievedNonleaders);
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

  const setLeader = async (memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.setLeader(classId, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        setNonLeaders((prevNonLeaders) =>
          prevNonLeaders.map((nonLeader) => {
            if (nonLeader.class_member_id === memberID) {
              nonLeader.teamember_status = GLOBALS.MEMBER_STATUS.PENDING;
              return nonLeader;
            }
            return nonLeader;
          })
        );
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

  return { nonLeaders, isRetrieving, setLeader };
};

export default useNonLeaders;
