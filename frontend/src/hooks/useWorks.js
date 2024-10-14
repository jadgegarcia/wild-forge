import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityService } from '../services';

const useWorks = (activityId, classId) => {
  const navigate = useNavigate();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [works, setWorks] = useState([]);

  const getWorksByActivity = async () => {
    let responseCode;
    let retrievedWorks;

    try {
      const res = await ActivityService.getAllWorkAttachmentsForActivity(activityId);
      responseCode = res?.status;
      retrievedWorks = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    // TODO
    switch (responseCode) {
      case 200:
        return retrievedWorks;
      case 404:
        break;
      case 500:
        break;
      default:
    }
  };

  const addWork = async (data) => {
    let responseCode;

    try {
      const res = await ActivityService.addWorkAttachments(data);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
    }
  };

  const updateWork = async (workId, data) => {
    let responseCode;

    try {
      const res = await ActivityService.updateWorkAttachments(workId, data);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
    }
  };

  const deleteWork = async (workId) => {
    let responseCode;

    try {
      const res = await ActivityService.deleteWorkAttachments(workId);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const getAllWork = async (_activityId) => {
    let responseCode;

    try {
      const res = await ActivityService.getAllWorkAttachmentsForActivity(_activityId);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
    }
  };

  const getWork = async (id) => {
    let responseCode;

    try {
      const res = await ActivityService.getWorkById(id);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
    }
  };

  return {
    addWork,
    getWorksByActivity,
    deleteWork,
    updateWork,
    getAllWork,
    getWork,
  };
};

export default useWorks;
