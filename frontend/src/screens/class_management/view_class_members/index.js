import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useClassMembers } from '../../../hooks';
import { UsersService } from '../../../services';

import Search from '../../../components/search';
import Table from '../../../components/table';

import { copyToClipBoard } from '../../../utils/copyToClipBoard';
import GLOBALS from '../../../app_globals';

import 'primeicons/primeicons.css';
import './index.scss';

const fetchUser = async (userId) => {
  try {
    const response = await UsersService.user(userId);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    return null;
  }
};


function ViewClassMembers() {
  const { user, classId, classRoom } = useOutletContext();

  const { deleteMember, acceptMember, classMembers } = useClassMembers(classId);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [flag, setFlag] = useState(false);
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (classMembers) {
        // Fetch all members except teachers
        const memberData = await Promise.all(
          classMembers
            .filter((member) => member.role !== GLOBALS.CLASSMEMBER_ROLE.TEACHER)
            .map(async (member) => {
              const { id, first_name, last_name, status } = member;
              try {
                // Fetch user info using user_id
                const response = await UsersService.user(member.user_id);
                const userInfo = response.data;

                // Determine role name based on user.role
                const role_name = userInfo.role === 1 ? 'Guest' : 'Student';
                if(userInfo.id === user.user_id) {
                  setFlag(true);
                };
                console.log("User logged in", user);
                console.log("User fetched ", userInfo);
                console.log("Flag", flag);
  
                // Prepare table data
                const actions =
                  status === GLOBALS.MEMBER_STATUS.PENDING ? (
                    <>
                      <button
                        type="btn"
                        className="btn btn-sm fw-bold text-success"
                        onClick={() => acceptMember(id)}
                      >
                        ACCEPT
                      </button>
                      <button
                        type="btn"
                        className="btn btn-sm fw-bold text-danger"
                        onClick={() => deleteMember(id)}
                      >
                        REJECT
                      </button>
                    </>
                  ) : (
                    <button
                      type="btn"
                      className="btn btn-sm fw-bold text-danger"
                      onClick={() => deleteMember(id)}
                    >
                      KICK
                    </button>
                  );
  
                 return {
                  id: member.id,
                  name: `${first_name} ${last_name}`,
                  status: member.status === GLOBALS.MEMBER_STATUS.PENDING ? 'PENDING' : 'ACCEPTED',
                  role: role_name,
                  ...(user?.role === GLOBALS.USER_ROLE.MODERATOR && !flag && { actions }),
                };

              } catch (error) {
                console.error(`Error fetching user with ID ${member.user_id}:`, error);
                return null; // Skip this member if an error occurs
              }
            })
        );
  
        // Remove any null results from failed fetches
        const filteredData = memberData.filter((data) => data !== null);
  
        // Set table data state
        setTableData(filteredData);
      }
    };
  
    fetchUserDetails();
  }, [classMembers]);
  

  const headers = ['id', 'name', 'role', 'status'];
  if ((user?.role === GLOBALS.USER_ROLE.MODERATOR) && !flag) {
    headers.push('actions');
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchMember = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery.length === 0) {
      setFilteredData(tableData);
    } else {
      const filtered = tableData?.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(lowerCaseQuery)) ||
          (item.team && item.team.toLowerCase().includes(lowerCaseQuery)) ||
          (item.role && item.role.toLowerCase().includes(lowerCaseQuery)) ||
          (item.status && item.status.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    searchMember(searchQuery);
  }, [searchQuery, tableData, classMembers]);

  const handleCopyCode = () => {
    try{ 
      copyToClipBoard(classRoom?.class_code);
    } catch (error) {
      console.error(error);
    }
  };

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
    </div>
  );
  
  const renderTable = () => (
    <div className="d-flex flex-column justify-content-center pt-3 pb-3 px-5">
      {tableData && filteredData.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="brown-text fw-bold fs-5 py-2 mx-5">No members found</div>
        </div>
      ) : (
        <Table headers={headers} data={filteredData} className="mt-3" />
      )}
    </div>
  );

  const renderContent = () => (
    <div>
      <div className="d-flex">
        {renderSubheader()}
        <div className="d-flex align-items-center ms-auto mx-5">
          <Search value={searchQuery} onChange={handleSearchChange} />
        </div>
      </div>
      {renderTable()}
    </div>
  );

  return <div>{renderContent()}</div>;
}

export default ViewClassMembers;
