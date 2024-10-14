import React from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import Table from '../../table';
import './index.scss';
import GLOBALS from '../../../app_globals';

function ApplyTeam({ visible, handleModal, teamData, applyToTeam, isViewOnly }) {
  const tableheaders = ['id', 'members'];

  const members = teamData.team_members
    .filter((member) => member.status === GLOBALS.MEMBER_STATUS.ACCEPTED)
    .map((member) => {
      const { class_member_id, first_name, last_name } = member;
      return {
        id: class_member_id,
        members: `${first_name} ${last_name}`,
      };
    });

  const isFull = teamData.status === GLOBALS.TEAM_STATUS.CLOSE;

  const renderViewTeamDataModal = () => (
    <Dialog
      className="modal-apply-team p-4"
      visible={visible}
      onHide={handleModal}
      showHeader={false}
    >
      <div className="d-grid gap-3 p-3">
        <button aria-label="Close Modal" className="btn btn-close ms-auto" onClick={handleModal} />
        <div className="px-3">
          <div className="fw-bold fs-4">{teamData.name}</div>
          <div className="py-3 lh-lg text-justify">
            {teamData.description ? teamData.description : 'No description.'}
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Table headers={tableheaders} data={members} />
          </div>
        </div>
      </div>
      {isViewOnly && (
        <div className="d-flex flex-row justify-content-end">
          <button
            type="submit"
            className="btn btn-yellow-primary btn-create-team-modal mx-auto fw-semibold"
            disabled={isFull}
            onClick={() => {
              applyToTeam(teamData.id);
              Swal.fire('Please wait for the Leader to accept your request');
              handleModal();
            }}
          >
            {isFull ? 'Hiring is CLOSED' : 'Apply'}
          </button>
        </div>
      )}
    </Dialog>
  );

  return <>{renderViewTeamDataModal()}</>;
}

ApplyTeam.defaultProps = {
  visible: false,
  handleModal: () => {},
  teamData: {},
  applyToTeam: () => {},
  isViewOnly: true,
};

ApplyTeam.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
  teamData: PropTypes.objectOf(PropTypes.any),
  applyToTeam: PropTypes.func,
  isViewOnly: PropTypes.bool,
};

export default ApplyTeam;
