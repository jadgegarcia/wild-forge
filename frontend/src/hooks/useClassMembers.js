import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';
import GLOBALS from '../app_globals';

const useClassMembers = (classId) => {
  const navigate = useNavigate();
  const [classMembers, setClassMembers] = useState([]);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const deleteMember = async (memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.delete(classId, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        setClassMembers((prevClassMembers) =>
          prevClassMembers.filter((member) => member.id !== memberID)
        );
        break;
      case 404:
        navigate(`/classes/${classId}/members`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const acceptMember = async (memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.accept(classId, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 202:
        setClassMembers((prevClassMembers) =>
          prevClassMembers.map((member) => {
            if (member.id === memberID) {
              return { ...member, status: GLOBALS.MEMBER_STATUS.ACCEPTED };
            }

            return member;
          })
        );
        break;
      case 404:
        navigate(`/classes/${classId}/members`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedClassMembers;

      try {
        const res = await ClassRoomsService.members(classId);
        responseCode = res?.status;
        retrievedClassMembers = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setClassMembers(retrievedClassMembers);
          break;
        case 404:
          navigate(`/classes/${classId}/members`);
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

  return {
    isRetrieving,
    classMembers,
    deleteMember,
    acceptMember,
  };
};

export default useClassMembers;
