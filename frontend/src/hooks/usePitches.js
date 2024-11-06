import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PitchesService } from '../services';

const usePitches = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pitches, setPitches] = useState([]);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedPitches;

      try {
        const res = await PitchesService.all();
        responseCode = res?.status;
        retrievedPitches = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setPitches(retrievedPitches);
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

  return { isLoading, pitches };
};

export default usePitches;
