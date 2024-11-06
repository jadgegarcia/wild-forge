import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamService, ActivityService } from '../services';

const useActivity = (classId, teamId, activityId) => {
  const navigate = useNavigate();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (!classId || !activityId || !teamId) {
      return;
    }
    const get = async () => {
      let responseCode;
      let retrievedActivity;

      try {
        const res = await ActivityService.getActivity(classId, teamId, activityId);

        responseCode = res?.status;
        retrievedActivity = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setActivity(retrievedActivity);
          break;
        case 404:
          navigate(`/classes/${classId}/activities`);
          break;
        case 500:
          navigate('/classes');
          break;
        default:
      }

      setIsRetrieving(false);
    };

    get();
  }, [classId, activityId, teamId]);

  const getActivity = async (classId2, teamId2, activityId2) => {
    let responseCode;

    try {
      const res = await ActivityService.getActivity(classId2, teamId2, activityId2);
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

  const updateActivity = async (data) => {
    let responseCode;

    try {
      console.log(classId, teamId, activityId);
      console.log('data', data);
      const res = await TeamService.updateTeamActivity(classId, teamId, activityId, data);
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

  const deleteTeamActivity = async () => {
    let responseCode;

    try {
      const res = await TeamService.deleteTeamActivity(classId, teamId, activityId);
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

  const createActivity = async (data) => {
    let responseCode;

    try {
      const res = await ActivityService.createActivity(classId, data);
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

  const createFromTemplate = async (data) => {
    let responseCode;

    try {
      const res = await ActivityService.createFromTemplate(classId, data);
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

  const submitActivity = async (classId3, teamId3, activityId3, data) => {
    let responseCode;

    try {
      const res = await ActivityService.submitOrUnsubmit(classId3, teamId3, activityId3, data);
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
  return {
    isRetrieving,
    activity,
    getActivity,
    updateActivity,
    deleteTeamActivity,
    createActivity,
    createFromTemplate,
    submitActivity,
  };
};

export default useActivity;
