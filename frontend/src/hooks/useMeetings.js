import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetingsService } from '../services';

const useMeetings = (classroom, status) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedMeetings;

      try {
        const res = await MeetingsService.all(classroom, status);

        responseCode = res?.status;
        retrievedMeetings = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setMeetings(retrievedMeetings);
          break;
        case 404:
        case 500:
          // navigate('/classes');
          break;
        default:
      }

      setIsLoading(false);
    };

    get();
  }, []);

  return { isLoading, meetings };
};

export default useMeetings;
