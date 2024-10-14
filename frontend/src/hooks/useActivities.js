import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityService, TeamService } from '../services';

const useActivities = (classId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!classId) {
      return;
    }
    const get = async () => {
      let responseCode;
      let retrievedActivities;
      try {
        const res = await ActivityService.allActivities(classId);

        responseCode = res?.status;
        retrievedActivities = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setActivities(retrievedActivities);
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
  }, [classId]);

  // FIXME: Evaluations must be on the useActivity because it only change one activity
  const addEvaluation = async (teamId, activityId, evaluation) => {
    let responseCode;

    try {
      const res = await ActivityService.addEvaluation(classId, teamId, activityId, evaluation);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const deleteEvaluation = async (teamId, activityId) => {
    let responseCode;

    try {
      const res = await ActivityService.deleteEvaluation(classId, teamId, activityId);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        setActivities((prevActivitiies) =>
          prevActivitiies.filter((activity) => activity.id !== activityId)
        );
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

  return { isLoading, activities, addEvaluation, deleteEvaluation };
};

export default useActivities;
