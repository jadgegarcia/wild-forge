import React, { useState } from 'react';

import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

import './index.scss';
import GLOBALS from '../../../app_globals';
import Swal from 'sweetalert2';

function AssignNewLeader({
  visible,
  handleModal,
  hasDropdown,
  members,
  teamId,
  leaderId,
  leaveTeam,
  setLeader,
}) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Dialog className="remarks-modal" visible={visible} onHide={handleModal} showHeader={false}>
      <div className="d-flex flex-column p-5">
        <div className="d-grid gap-3">
          <div className="text-center fs-4 fw-bold">
            {' '}
            Before leaving your team, you must appoint a New Leader.
          </div>
          {hasDropdown && (
            <div className="d-flex flex-column">
              <div className="text-left fs-6 fw-semibold">Appoint a New Leader</div>
              <select
                className="form-select form-select-sm"
                value={selectedOption}
                onChange={handleDropdownChange}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {members
                  .filter((member) => member.role === GLOBALS.TEAMMEMBER_ROLE.MEMBER)
                  .map((member) => (
                    <option key={member.class_member_id} value={member.class_member_id}>
                      {member?.first_name} {member?.last_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="d-flex flex-row justify-content-center mt-3">
            <button className="btn btn-cancel-secondary fw-semibold mx-auto" onClick={handleModal}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-yellow-primary btn-create-team-modal mx-auto fw-semibold"
              onClick={() => {
                setLeader(selectedOption);

                if (selectedOption !== '') {
                  leaveTeam(teamId, leaderId);
                  handleModal();
                } else {
                  Swal.fire('Error', 'Please select a new leader', 'error')
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

AssignNewLeader.defaultProps = {
  visible: false,
  handleModal: () => {},
  hasDropdown: false,
  members: [],
  teamId: '',
  leaderId: '',
  leaveTeam: () => {},
  setLeader: () => {},
};

AssignNewLeader.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
  hasDropdown: PropTypes.bool,
  members: PropTypes.arrayOf(PropTypes.object),
  teamId: PropTypes.string,
  leaderId: PropTypes.string,
  leaveTeam: PropTypes.func,
  setLeader: PropTypes.func,
};

export default AssignNewLeader;
