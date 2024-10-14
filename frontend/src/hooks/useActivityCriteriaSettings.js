import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCriteriaSettingsService from '../services/ActivityCriteriaSettingsService';

const useActivityCriteriaSettings = (classId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      let responseCode;
      let retrievedActivityCriteriaSettings;

      try {
        const res = await ActivityCriteriaSettingsService.all();

        responseCode = res?.status;
        retrievedActivityCriteriaSettings = res?.data;

        console.log("retrievedActivityCriteriaSettings: " + JSON.stringify(retrievedActivityCriteriaSettings, null, 2));

      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
            setSettings(retrievedActivityCriteriaSettings);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }

      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const createActivityCriteriaSettings = async (data) => {
    let responseCode;

    try {
      const res = await ActivityCriteriaSettingsService.create(data);
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

  const updateActivityCriteriaSettings = async (id, data) => {
    let responseCode;

    try {
      const res = await ActivityCriteriaSettingsService.update(id, data);
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

  const getActivityCriteriaSettingsById = async (id) => {
    let responseCode;
    let activityCriteriaSettings;
    try {
      const res = await ActivityCriteriaSettingsService.get(id);

      responseCode = res?.status;
      activityCriteriaSettings = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        return { success: true, data: activityCriteriaSettings };
        // setActivityCriteria(activityCriteria);
      case 400:
      case 404:
      case 500:
      default:
    }
  };

  return { isLoading, settings, createActivityCriteriaSettings, updateActivityCriteriaSettings, getActivityCriteriaSettingsById };
};

export default useActivityCriteriaSettings;
