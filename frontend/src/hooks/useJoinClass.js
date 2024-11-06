import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';

const useJoinClass = () => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);

  const joinClass = async ({ classCode, callbacks }) => {
    setIsJoining(true);
    let responseCode;
    let retrievedMessage;

    try {
      const res = await ClassRoomsService.join({
        class_code: classCode,
      });

      responseCode = res?.status;
      retrievedMessage = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        await callbacks.joined({ retrievedMessage });
        break;
      case 400:
        await callbacks.invalidFields();
        break;
      case 404:
        navigate('/classes');
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsJoining(false);
  };

  return { isJoining, joinClass };
};

export default useJoinClass;
