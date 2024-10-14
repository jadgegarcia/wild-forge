import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';

const useClassMember = (classId, userId) => {
  const navigate = useNavigate();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [classMember, setClassMember] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    if (classId === undefined || userId === undefined) {
      return;
    }

    const get = async () => {
      let responseCode;
      let retrievedClassMember;

      try {
        const res = await ClassRoomsService.member(classId, userId);

        responseCode = res?.status;
        retrievedClassMember = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setClassMember(retrievedClassMember);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }

      setIsRetrieving(false);
    };

    get();
  }, []);

  useEffect(() => {
    if (classMember) {
      const get = async () => {
        let responseCode;
        let retrievedTeam;

        try {
          const res = await ClassRoomsService.classMemberTeam(classId, classMember.id);

          responseCode = res?.status;
          retrievedTeam = res?.data[1];
        } catch (error) {
          responseCode = error?.response?.status;
        }

        switch (responseCode) {
          case 200:
            setTeam(retrievedTeam);
            break;
          case 404:
          case 500:
            navigate('/classes');
            break;
          default:
        }

        setIsRetrieving(false);
      };

      get();
    }
  }, [classMember]);

  return { isRetrieving, classMember, team };
};

export default useClassMember;
