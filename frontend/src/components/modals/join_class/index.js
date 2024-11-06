import React from 'react';

import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { isObjectEmpty } from '../../../utils/object';

import './index.scss';
import ControlInput from '../../controlinput';
import { useJoinClass } from '../../../hooks';

const validate = (values) => {
  const errors = {};

  if (!values.class_code) {
    errors.class_code = 'Field is required';
  } else if (values.class_code.length > 50) {
    errors.class_code = 'Class code is too long';
  }

  return errors;
};

function JoinClass({ visible, handleModal }) {
  const { isJoining, joinClass } = useJoinClass();

  return (
    <Dialog
      className="join-class-modal p-3"
      visible={visible}
      onHide={handleModal}
      showHeader={false}
    >
      <div className="d-flex flex-column">
        <Formik
          initialValues={{
            class_code: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            const errors = validate(values);
            if (!isObjectEmpty(errors)) {
              setErrors(errors);
              return;
            }

            const joinClassCallbacks = {
              joined: ({ retrievedMessage }) => {
                Swal.fire('Please wait for the Teacher to accept your request');
                handleModal(); // Close modal
              },
              invalidFields: () => {
                errors.class_code = 'Invalid Class Code';
                setErrors(errors);
              },
              internalError: () => {
                Swal.fire('Internal Error: Oops, something went wrong. Please try again.');
              },
            };

            await joinClass({
              classCode: values.class_code,
              callbacks: joinClassCallbacks,
            });
          }}
        >
          {({ errors, values, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-row justify-content-center">
                <ControlInput
                  name="class_code"
                  className="yellow-on-focus"
                  label="Join Class"
                  placeholder="Enter Class Code"
                  value={values.class_code}
                  onChange={(e) => setFieldValue('class_code', e.target.value)}
                  error={errors.class_code}
                />
                <button className="btn btn-yellow-primary fw-semibold ms-2 mt-5" type="submit">
                  {isJoining ? 'Joining...' : 'Join'}
                </button>
              </div>
            </form>
          )}
        </Formik>

        <button
          aria-label="Close Modal"
          className="btn btn-close ms-auto join-class-close"
          onClick={handleModal}
        />
      </div>
    </Dialog>
  );
}

JoinClass.defaultProps = {
  visible: false,
  handleModal: () => {},
};

JoinClass.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
};

export default JoinClass;
