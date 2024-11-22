import React from 'react';

import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { isObjectEmpty } from '../../../utils/object';

import './index.scss';
import ControlInput from '../../controlinput';
import { ClassRoomsService } from '../../../services';

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Field is required';
  } else if (values.email.length > 50) {
    errors.email = 'Class code is too long';
  }

  return errors;
};

function InviteMeeting({ visible, handleModal, classId }) {

  return (
    <Dialog
      className="invite-meeting-modal p-3"
      visible={visible}
      onHide={handleModal}
      showHeader={false}
    >
      <div className="d-flex flex-column">
        <Formik
          initialValues={{
            classId: classId,
            email: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            const errors = validate(values);
            if (!isObjectEmpty(errors)) {
              setErrors(errors);
              return;
            }

            const data = {
                  classId: classId,
                  email: values.email,
            };
            console.log("MAO NI ANG EMAIL:", data);
            try {
              await ClassRoomsService.inviteToClass(data);
              Swal.fire('Invitation sent!', `An invitation has been sent to ${values.email}`, 'success');
            } catch (error) {
              console.error('Error inviting to class:', error);
              Swal.fire('Error', 'Failed to send the invitation', 'error');
            }
          }}
        >
          {({ errors, values, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-row justify-content-center">
                <ControlInput
                  name="email"
                  className="yellow-on-focus"
                  label="Invite to Meeting"
                  placeholder="Enter Email"
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  error={errors.email}
                />
                <button className="btn btn-yellow-primary fw-semibold ms-2 mt-5" type="submit">
                  Invite
                </button>
              </div>
            </form>
          )}
        </Formik>

        <button
          aria-label="Close Modal"
          className="btn btn-close ms-auto invite-meeting-close"
          onClick={handleModal}
        />
      </div>
    </Dialog>
  );
}

InviteMeeting.defaultProps = {
  visible: false,
  handleModal: () => {},
};

InviteMeeting.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
};

export default InviteMeeting;
