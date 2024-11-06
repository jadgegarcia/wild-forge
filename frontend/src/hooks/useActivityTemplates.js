import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityTemplateService } from '../services';

const useActivityTemplates = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [templatesByCourse, setTemplatesByCourse] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedTemplates;
      try {
        const res = await ActivityTemplateService.allActivityTemplates();

        responseCode = res?.status;
        retrievedTemplates = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setTemplates(retrievedTemplates);
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

  const createTemplate = async (templateData) => {
    let responseCode;
    let createdTemplate;
    try {
      const res = await ActivityTemplateService.createActivityTemplate(templateData);

      responseCode = res?.status;
      createdTemplate = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 201:
        setTemplates([...templates, createdTemplate]);
        break;
      case 400:
      case 404:
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedCourses;
      try {
        const res = await ActivityTemplateService.getAllCourse();

        responseCode = res?.status;
        retrievedCourses = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setCourses(retrievedCourses);
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
  return { isLoading, templates, templatesByCourse, courses, createTemplate };
};

export default useActivityTemplates;
