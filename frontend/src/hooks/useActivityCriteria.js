import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CriteriasService } from '../services';
import ActivityCriteriasService from '../services/ActivityCriteriasService';

const useActivityCriteria = (classId, teamId, criteriaId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activityCriterias, setActivityCriterias] = useState([]);
  // const [activityCriteria, setActivityCriteria] = useState(null);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedActivityCriterias;

      try {
        const res = await ActivityCriteriasService.all();

        responseCode = res?.status;
        retrievedActivityCriterias = res?.data;

        console.log(retrievedActivityCriterias);
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
            setActivityCriterias(retrievedActivityCriterias);
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

  const getActivityCriteriaById = async (id) => {
    let responseCode;
    let activityCriteria;
    try {
      const res = await ActivityCriteriasService.get(id);

      responseCode = res?.status;
      activityCriteria = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        return { success: true, data: activityCriteria };
        // setActivityCriteria(activityCriteria);
      case 400:
      case 404:
      case 500:
      default:
    }
  };

  const createActivityCriteria = async (data) => {
    let responseCode;

    try {
      const res = await ActivityCriteriasService.createActivityCriteria(data);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
        navigate(`/classes/${classId}/activities`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const updateActivityCriteria = async (data) => {
    let responseCode;

    try {
      console.log(classId, teamId, activityId);
      console.log('data', data);
      const res = await ActivityCriteriasService.updateActivityCriteria(classId, teamId, criteriaId, data);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
        navigate(`/classes/${classId}/activities`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  return { isLoading, activityCriterias, getActivityCriteriaById, createActivityCriteria, updateActivityCriteria };
};

export default useActivityCriteria;
