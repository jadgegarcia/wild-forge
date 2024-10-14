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
        
        if (responseCode === 200) {
          setSettings(retrievedActivityCriteriaSettings);
        }
      } catch (error) {
        responseCode = error?.response?.status || 500; // Handle possible undefined status
      }

      if (responseCode === 404 || responseCode === 500) {
        navigate('/classes');  // Redirect if not found or server error
      }

      setIsLoading(false);
    };

    fetchSettings();
  }, [classId, navigate]); // Add classId to dependency array

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

      if (responseCode === 200) {
        setSettings((prevSettings) => 
          prevSettings.map((setting) => (setting.id === id ? res.data : setting))
        ); // Update the state with the new data
      }
    } catch (error) {
      responseCode = error?.response?.status || 500;
    }

    if (responseCode === 404 || responseCode === 500) {
      navigate('/classes');
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
