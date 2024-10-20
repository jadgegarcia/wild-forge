import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCriteriaSettingsService from '../services/ActivityCriteriaSettingsService';

const useActivityCriteriaSettings = (classId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState([]);

  // Fetch settings when component mounts or classId changes
  useEffect(() => {
    const fetchSettings = async () => {
      let responseCode;
      let retrievedActivityCriteriaSettings;

      try {
        const res = await ActivityCriteriaSettingsService.all();
        responseCode = res?.status;
        retrievedActivityCriteriaSettings = res?.data;
        
        console.log("retrievedActivityCriteriaSettings:", retrievedActivityCriteriaSettings);
        
      } catch (error) {
        responseCode = error?.response?.status // Handle possible undefined status
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

      if (responseCode === 200) {
        setSettings((prevSettings) => [...prevSettings, res.data]); // Add newly created setting
      }
    } catch (error) {
      responseCode = error?.response?.status || 500;
    }

    if (responseCode === 404 || responseCode === 500) {
      navigate('/classes'); // Redirect on error
    }
  };

  const updateActivityCriteriaSettings = async (id, data) => {
    let responseCode;

    try {
      const res = await ActivityCriteriaSettingsService.update(id, data);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status
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

      if (responseCode === 200) {
        return { success: true, data: activityCriteriaSettings };
      }
    } catch (error) {
      responseCode = error?.response?.status || 500;
    }

    if (responseCode === 404 || responseCode === 500) {
      navigate('/classes'); // Redirect on error
    }

    return { success: false, error: responseCode }; // Return failure status
  };

  return {
    isLoading,
    settings,
    createActivityCriteriaSettings,
    updateActivityCriteriaSettings,
    getActivityCriteriaSettingsById,
  };
};

export default useActivityCriteriaSettings;
