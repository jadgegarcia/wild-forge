import { useState } from 'react';

import { ClassRoomsService } from '../services';

const useCreateClass = () => {
  const [isCreating, setIsCreating] = useState(true);

  const createClass = async ({ course_name, sections, schedule, max_teams_members, callbacks }) => {
    setIsCreating(true);

    let responseCode;
    let retrievedClass;

    try {
      const res = await ClassRoomsService.create({
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
      case 201:
        await callbacks.created({ retrievedClass });
        break;
      case 400:
        await callbacks.invalidFields();
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsCreating(false);
  };

  return { isCreating, createClass };
};

export default useCreateClass;
