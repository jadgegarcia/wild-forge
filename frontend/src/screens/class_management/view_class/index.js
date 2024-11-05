import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import './index.scss';
import Swal from 'sweetalert2';
import GLOBALS from '../../../app_globals';
import UpdateClass from '../../../components/modals/update_class';
import { useClasses } from '../../../hooks';
import { copyToClipBoard } from '../../../utils/copyToClipBoard';
import { ClassRoomsService } from '../../../services';

function ViewClass() {
  const { user, classRoom } = useOutletContext();
  const { deleteClass } = useClasses(classRoom?.id);

  const [updateClassModalOpen, setUpdateClassModalOpen] = useState(false);
  const [numberOfStudents, setNumberOfStudents] = useState(classRoom?.number_of_students);
  const [numberOfTeams, setNumberOfTeams] = useState(classRoom?.number_of_teams);

  useEffect(() => {
    if (classRoom) {
      setNumberOfStudents(classRoom?.number_of_students);
      setNumberOfTeams(classRoom?.number_of_teams);
    }
  }, [classRoom?.number_of_students, classRoom?.number_of_teams]);

  const handleCopyCode = () => {
    try {
      copyToClipBoard(classRoom?.class_code);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClass = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this class!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClass();
      } else {
        Swal.fire('Cancelled', 'Your class is safe :)', 'error');
      }
    });
  };

  const handleInviteToClass = async () => {
    // sample logic ni sya
    const data = {
        classId: '1',
        email: 'student2@gmail.com'
    };
    await ClassRoomsService.inviteToClass(data);
  }

  const renderSubheader = () => (
    <div className="d-flex pt-2 pb-2">
      <div className="px-5">
        <div className="d-flex align-items-center fw-bold fs-5 brown-text">
          {classRoom?.name} {classRoom?.sections}
        </div>
        <div className="d-flex py-2">
          <div className="d-flex align-items-center fw-semibold fs-6">{classRoom?.schedule}</div>
          <div className="d-flex align-items-center ps-4 pe-2 fw-semibold fs-6">
            {classRoom?.class_code}
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
            Copy
          </button>
        </div>
      </div>
      {user?.role === GLOBALS.USER_ROLE.MODERATOR && (
        <div className="d-flex align-items-center me-5 ms-auto">
          {/* ARI PAG CREATE UG INVITE NGA BUTTON*/}
          <button
            type="button"
            className="btn btn-info ms-auto ms-2"
            onClick={() => setUpdateClassModalOpen(true)}
          >
            Edit
          </button>
          <button type="button" className="btn btn-danger ms-2" onClick={handleDeleteClass}>
            Delete
          </button>
        </div>
      )}
    </div>
  );

  const renderBody = () => (
    <div className="d-flex justify-content-center pt-3 pb-3 px-5">
      <div className="d-flex flex-row">
        <div className="pe-5">
          <div className="students-container">
            <div className="fw-bold fs-1">{numberOfStudents}</div>
            <div className="ms-auto fw-semibold fs-3 mx-5">Students</div>
          </div>
        </div>
        <div className="ps-5">
          <div className="teams-container">
            <div className="fw-bold fs-1">{numberOfTeams}</div>
            <div className="ms-auto fw-semibold fs-3 mx-5">Teams</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => <div>{renderBody()}</div>;

  return (
    <div>
      {renderSubheader()}
      {renderContent()}
      <UpdateClass
        visible={updateClassModalOpen}
        handleModal={() => setUpdateClassModalOpen(false)}
        classroom={classRoom}
      />
    </div>
  );
}

export default ViewClass;
