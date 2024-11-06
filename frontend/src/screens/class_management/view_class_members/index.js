import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useClassMembers } from '../../../hooks';

import Search from '../../../components/search';
import Table from '../../../components/table';

import { copyToClipBoard } from '../../../utils/copyToClipBoard';
import GLOBALS from '../../../app_globals';

import 'primeicons/primeicons.css';
import './index.scss';

function ViewClassMembers() {
  const { user, classId, classRoom } = useOutletContext();

  const { deleteMember, acceptMember, classMembers } = useClassMembers(classId);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (classMembers) {
      const data = classMembers
        .filter((member) => member.role !== GLOBALS.CLASSMEMBER_ROLE.TEACHER)
        .map((member) => {
          const { id, first_name, last_name, status } = member;

          let tb_data = {};

          const actions =
            status === GLOBALS.MEMBER_STATUS.PENDING ? (
              <>
                <button
                  type="btn"
                  className="btn btn-sm fw-bold text-success"
                  onClick={() => {
                    acceptMember(id);
                  }}
                >
                  ACCEPT
                </button>
                <button
                  type="btn"
                  className="btn btn-sm fw-bold text-danger"
                  onClick={() => {
                    deleteMember(id);
                  }}
                >
                  REJECT
                </button>
              </>
            ) : (
              <button
                type="btn"
                className="btn btn-sm fw-bold text-danger"
                onClick={() => {
                  deleteMember(id);
                }}
              >
                KICK
              </button>
            );

          tb_data = {
            id,
            name: `${first_name} ${last_name}`,
            status: status === GLOBALS.MEMBER_STATUS.PENDING ? 'PENDING' : 'ACCEPTED',
            role: 'Student',
          };

          if (user?.role === GLOBALS.USER_ROLE.MODERATOR) tb_data.actions = actions;

          return tb_data;
        });

      setTableData(data);
    }
  }, [classMembers]);

  const headers = ['id', 'name', 'role', 'status'];
  if (user?.role === GLOBALS.USER_ROLE.MODERATOR) {
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
