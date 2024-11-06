import React, { useEffect, useState } from 'react';

import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

import './index.scss';
import { useParams } from 'react-router-dom';

import { useNonLeaders, useTeams } from '../../../hooks';

import Table from '../../table';
import Search from '../../search';

import GLOBALS from '../../../app_globals';

function AddLeaders({ visible, handleModal }) {
  const { id: classId } = useParams();
  const { nonLeaders, setLeader, isRetrieving } = useNonLeaders(classId);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [nonLeadersTable, setNonLeadersTable] = useState([]);

  useEffect(() => {
    if (nonLeaders) {
      const nonLeadersData = nonLeaders.map((n) => {
        const { class_member_id, first_name, last_name, teamember_status } = n;

        let tb_data = {};

        const actions =
          teamember_status === GLOBALS.MEMBER_STATUS.PENDING ? (
            <button type="button" className="btn btn-yellow-primary fw-semibold" disabled>
              Pending
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-yellow-primary fw-semibold"
              onClick={() => {
                setLeader(class_member_id);
              }}
            >
              Select as Leader
            </button>
          );

        tb_data = {
          id: class_member_id,
          name: `${first_name} ${last_name}`,
          actions,
        };

        return tb_data;
      });

      setNonLeadersTable(nonLeadersData);
    }
  }, [nonLeaders]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchMember = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery.length === 0) {
      setFilteredData(nonLeadersTable);
    } else {
      const filtered = nonLeadersTable?.filter((item) =>
        item.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    searchMember(searchQuery);
  }, [searchQuery, nonLeadersTable, nonLeaders]);

  return (
    <Dialog className="option-modal" visible={visible} onHide={handleModal} showHeader={false}>
      <div className="d-flex flex-column">
        <button aria-label="Close Modal" className="btn btn-close ms-auto" onClick={handleModal} />
        <div className="d-flex align-items-center justify-content-between text-left fs-5 fw-bold">
          <span>Students List</span>
          <Search value={searchQuery} onChange={handleSearchChange} />
        </div>
        <Table headers={['id', 'name', 'actions']} data={filteredData} className="mt-3" />
      </div>
    </Dialog>
  );
}

AddLeaders.defaultProps = {
  visible: false,
  handleModal: () => {},
};

AddLeaders.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
};

export default AddLeaders;
