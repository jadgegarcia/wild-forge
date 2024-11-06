import React from 'react';

import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

import ControlTextArea from '../../controltextarea';

import './index.scss';

function DischargeNotifModal({ modalTitle, visible, handleModal }) {
  const isDisabled = true;

  return (
    <Dialog className="notifs-modal" visible={visible} onHide={handleModal} showHeader={false}>
      <div className="d-flex flex-column p-5">
        <div className="d-grid gap-3">
          <div className="text-center fs-3 fw-bold">{modalTitle}</div>
          <ControlTextArea name="remarks" label="Remarks:" disabled={isDisabled} />
          <ControlTextArea name="remarks" label="Appeal:" />
          <div className="d-flex flex-row justify-content-center mt-3">
            <button className="btn btn-outline-danger fw-semibold mx-auto" onClick={handleModal}>
              Appeal
            </button>
            <button type="submit" className="btn btn-wild-primary mx-auto fw-semibold">
              Accept
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

DischargeNotifModal.defaultProps = {
  modalTitle: '',
  visible: false,
  handleModal: () => {},
};

DischargeNotifModal.propTypes = {
  modalTitle: PropTypes.string,
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
};

export default DischargeNotifModal;
