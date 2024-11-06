import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetingsService } from '../services';

const useMeeting = (meetingId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [meeting, setMeeting] = useState({});

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedMeeting;

      try {
        const res = await MeetingsService.get(meetingId);
        responseCode = res?.status;
        retrievedMeeting = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setMeeting(retrievedMeeting);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }

      setIsLoading(false);
    };

    get();
  }, []);

  return { isLoading, meeting };
};

export default useMeeting;
