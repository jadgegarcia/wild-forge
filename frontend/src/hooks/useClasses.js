import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ClassRoomsService } from '../services';

const useClasses = (classId) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(true);

  const updateClass = async ({ course_name, sections, schedule, max_teams_members, callbacks }) => {
    setIsUpdating(true);

    let responseCode;
    let retrievedClass;

    try {
      const res = await ClassRoomsService.updateClass(classId, {
        course_name,
        sections,
        schedule,
        max_teams_members,
      });

      responseCode = res?.status;
      retrievedClass = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        await callbacks.updated({ retrievedClass });
        break;
      case 400:
        await callbacks.invalidFields();
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsUpdating(false);
  };

  const deleteClass = async () => {
    let responseCode;

    try {
      const res = await ClassRoomsService.deleteClass(classId);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        Swal.fire({
          title: 'Class Successfully Deleted',
          icon: 'success',
        }).then(() => {
          navigate('/classes');
        });
        break;
      case 404:
        console.log('Class not found');
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  return {
    isUpdating,
    updateClass,
    deleteClass,
  };
};

export default useClasses;
