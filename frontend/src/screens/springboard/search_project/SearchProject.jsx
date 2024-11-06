import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useAuth } from '../../../contexts/AuthContext';

import ProjectContents from '../components/ProjectDetails/ProjectContent';
import Header from '../../../components/header';
import Sidebar from '../../../components/Sidebar';
import GLOBALS from '../../../app_globals';

function SearchProject() {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  const { projId } = useParams();
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const isClass = user.role === 1;
  const isTeacherSearch = user.role === 1;

  let buttons;
  if (user?.role === GLOBALS.USER_ROLE.MODERATOR) {
    buttons = GLOBALS.SIDENAV_MODERATOR;
  } else {
    buttons = GLOBALS.SIDENAV_DEFAULT;
  }

  const goBack = () => {
    const back = sessionStorage.getItem('prevUrlSearch');
    navigate(`${back}`);
  };

  const searchContent = () => (
    <div className="px-5 d-flex justify-content-start">
      {!disable && (
        <span style={{ cursor: 'pointer' }} onClick={goBack}>
          <IoArrowBackSharp />
        </span>
      )}
      <ProjectContents
        isTeacherSearch={isTeacherSearch}
        setDisable={setDisable}
        selected={projId}
        isClass={isClass}
      />
    </div>
  );

  return isClass ? (
    <div className="d-flex">
      <Sidebar name={`${user?.first_name} ${user?.last_name}`} sidebarItems={buttons} />
      <div className="container-fluid d-flex flex-column">
        <Header />
        {searchContent()}
      </div>
    </div>
  ) : (
    // for student display. Theres already the classroom layout that's why it is sufficient
    // to output immediately the search content
    searchContent()
  );
}

export default SearchProject;
