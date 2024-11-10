import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCriteriasRelationService from '../services/ActivityCriteriasRelationService'; // Ensure this service exists

const useActivityCriteriaRelation = (classId, teamId, relationId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activityCriteriaRelations, setActivityCriteriaRelations] = useState([]);

  useEffect(() => {
    const getRelations = async () => {
      let responseCode;
      let retrievedRelations;

      try {
        const res = await ActivityCriteriasRelationService.all();

        responseCode = res?.status;
        retrievedRelations = res?.data;

        console.log(retrievedRelations);
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setActivityCriteriaRelations(retrievedRelations);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }

      setIsLoading(false);
    };

    getRelations();
  }, []);

  const getActivityCriteriaRelationById = async (id) => {
    let responseCode;
    let relation;

    try {
      const res = await ActivityCriteriasRelationService.get(id);

      responseCode = res?.status;
      relation = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        return { success: true, data: relation };
      case 400:
      case 404:
      case 500:
      default:
        return { success: false };
    }
  };

  const createActivityCriteriaRelation = async (data) => {
    let responseCode;

    try {
      const res = await ActivityCriteriasRelationService.createActivityCriteriaRelation(data);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 201: // Assuming creation returns 201
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

  const updateActivityCriteriaRelation = async (id, data) => {
    let responseCode;

    try {
      const res = await ActivityCriteriasRelationService.updateActivityCriteriaRelation(id, data);
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

  const getActivityCriteriaByActivityId = async (activityId) => {
    let responseCode;
    let relationsByActivityId;

    try {
      const res = await ActivityCriteriasRelationService.getByActivityId(activityId); // Using the new method from the service
      responseCode = res?.status;
      relationsByActivityId = res?.data;

      console.log(relationsByActivityId);
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        return relationsByActivityId;
        break;
      case 404:
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };


  return {
    isLoading,
    activityCriteriaRelations,
    getActivityCriteriaRelationById,
    createActivityCriteriaRelation,
    updateActivityCriteriaRelation,
    getActivityCriteriaByActivityId,
  };
};

export default useActivityCriteriaRelation;
