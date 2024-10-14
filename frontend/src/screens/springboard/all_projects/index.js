import React, { useState, useEffect, useRef } from 'react';
// import { useOutletContext } from 'react-router-dom';
import PublicTable from '../components/Table/PublicTable';
import { useProjects } from '../../../hooks';

import 'primeicons/primeicons.css';
import './index.scss';

function SpringBoardAllProjects() {
  // const { user, classId, classRoom } = useOutletContext();
  const { allclassteamproj } = useProjects();
  const [allProjects, setAllProjects] = useState();
  const [isActive, setIsActive] = useState(
    sessionStorage.getItem('selectedStatus') === 'Active Projects' ||
      sessionStorage.getItem('selectedStatus') === null
  );

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
  );
}

export default SpringBoardAllProjects;
