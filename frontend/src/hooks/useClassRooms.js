import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassRoomsService } from '../services';

const useClassRooms = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedClasses;

      try {
        const res = await ClassRoomsService.all();

        responseCode = res?.status;
        retrievedClasses = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setClasses(retrievedClasses);
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

  return { isLoading, classes };
};

export default useClassRooms;
