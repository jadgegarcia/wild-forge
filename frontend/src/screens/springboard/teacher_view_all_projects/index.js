import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useAuth } from '../../../contexts/AuthContext';

import Header from '../../../components/header';
import Sidebar from '../../../components/Sidebar';
import PublicTable from '../components/Table/PublicTable';
import { useProjects } from '../../../hooks';

import GLOBALS from '../../../app_globals';
import 'primeicons/primeicons.css';
import './index.scss';

function SpringBoardTeacherAllProjects() {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  const { allclassteamproj } = useProjects();
  const [allProjects, setAllProjects] = useState();
  const [isActive, setIsActive] = useState(
    sessionStorage.getItem('selectedStatus') === 'Active Projects' ||
      sessionStorage.getItem('selectedStatus') === null
  );

  let buttons;
  if (user?.role === GLOBALS.USER_ROLE.MODERATOR) {
    buttons = GLOBALS.SIDENAV_MODERATOR;
  } else {
    buttons = GLOBALS.SIDENAV_DEFAULT;
  }

  useEffect(() => {
    sessionStorage.setItem('selectedStatus', isActive ? 'Active Projects' : 'Inactive Projects');

    const currentPath = window.location.pathname;
    sessionStorage.setItem('dashboard', currentPath);
  }, [isActive]);

  useEffect(() => {
    const fetchData = async () => {
      const groupResponse = await allclassteamproj();
      setAllProjects(groupResponse.data);
    };
    fetchData();
  }, []);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setIsActive(selectedStatus === 'Active Projects');
  };

  if (!allProjects) {
    return <p>Loading...</p>;
  }

  return (
    <div className="d-flex">
      <Sidebar name={`${user?.first_name} ${user?.last_name}`} sidebarItems={buttons} />
      <div className="container-fluid d-flex flex-column">
        <Header />
        <div className="px-5">
          <div className="d-flex justify-content-between">
            <select
              id="status"
              className="textInput_select"
              onChange={handleStatusChange}
              value={isActive ? 'Active Projects' : 'Inactive Projects'}
            >
              <option>Active Projects</option>
              <option>Inactive Projects</option>
            </select>
          </div>
          <PublicTable isActive={isActive} allProjects={allProjects} />
        </div>
      </div>
    </div>
  );
}

export default SpringBoardTeacherAllProjects;
