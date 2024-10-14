import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityTemplateService } from '../services';

const useActivityTemplate = (templateId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState([]);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedTemplates;
      try {
        const res = await ActivityTemplateService.getActivityTemplate(templateId);

        responseCode = res?.status;
        retrievedTemplates = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setTemplate(retrievedTemplates);
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

  const updateTemplate = async (templateData) => {
    let responseCode;
    let updatedTemplate;
    try {
      const res = await ActivityTemplateService.updateActivityTemplate(templateId, templateData);

      responseCode = res?.status;
      updatedTemplate = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        setTemplate(updatedTemplate);
        break;
      case 400:
      case 404:
      case 500:
      default:
    }
  };

  const deleteTemplate = async () => {
    let responseCode;
    try {
      const res = await ActivityTemplateService.deleteActivityTemplate(templateId);

      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        setTemplate(null);
        break;
      case 400:
      case 404:
      case 500:
      default:
    }
  };
  return { isLoading, template, updateTemplate, deleteTemplate };
};

export default useActivityTemplate;
