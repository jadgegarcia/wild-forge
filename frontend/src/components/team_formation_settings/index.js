import React from 'react';
import PropTypes from 'prop-types';

import { Dialog } from 'primereact/dialog';
import ControlInput from '../controlinput';

import './index.scss';

function TeamFormationSettings({ visible, handleModal }) {
  return (
    <Dialog
      className="team-formation-modal"
      visible={visible}
      onHide={handleModal}
      showHeader={false}
    >
      <div className="d-grid gap-4">
        <button aria-label="Close Modal" className="btn btn-close ms-auto" onClick={handleModal} />
        <ControlInput name="name" label="Minimum Number of Members:" className="yellow-on-focus" />
        <ControlInput name="name" label="Maximum Number of Members:" className="yellow-on-focus" />
        <button
          aria-label="Save"
          className="btn btn-yellow-primary fs-5 fw-semibold"
          onClick={handleModal}
        >
          Save
        </button>
      </div>
    </Dialog>
  );
}

TeamFormationSettings.propTypes = {
  visible: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
};

TeamFormationSettings.defaultProps = {};

export default TeamFormationSettings;
