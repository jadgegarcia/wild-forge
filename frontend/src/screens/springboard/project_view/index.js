import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import ProjectContents from '../components/ProjectDetails/ProjectContent';

function ProjectView() {
  const { user, classId } = useOutletContext();
  const { projId } = useParams();
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const isClass = user.role === 1;

  const goBack = () => {
    navigate(`/classes/${classId}/projects`);
  };

  return (
    <div className="px-5 d-flex justify-content-start">
      {!disable && (
        <span style={{ cursor: 'pointer' }} onClick={goBack}>
          <IoArrowBackSharp />
        </span>
      )}
      <ProjectContents setDisable={setDisable} selected={projId} isClass={isClass} />
    </div>
  );
}

export default ProjectView;
