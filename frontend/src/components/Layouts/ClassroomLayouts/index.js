import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import jwtDecode from 'jwt-decode';

import { useAuth } from '../../../contexts/AuthContext';
import { useClassMember, useClassRoom } from '../../../hooks';

import Header from '../../header';
import Sidebar from '../../Sidebar';
import Loading from '../../loading';

import GLOBALS from '../../../app_globals';

import 'primeicons/primeicons.css';
import './index.scss';

function ClassroomLayout() {
  const { id: classId } = useParams();

  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  const { classMember, isRetrieving } = useClassMember(classId, user?.user_id);
  const { classRoom } = useClassRoom(classId);

  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    if (classMember) {
      if (classMember.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT) {
        setButtons(GLOBALS.SIDENAV_CLASSMEMBER(classId));
      }

      if (classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER) {
        setButtons(GLOBALS.SIDENAV_TEACHER(classId));
      }
    }
  }, [classMember]);

  return (
    <div>
      <div className="d-flex">
        <Sidebar
          name={`${user?.first_name} ${user?.last_name}`}
          sidebarItems={buttons}
          hasBackButton
        />
        <div className="container-fluid d-flex flex-column">
          <Header />
          {isRetrieving ? (
            <Loading />
          ) : (
            <Outlet context={{ user, classId, classMember, classRoom }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassroomLayout;
