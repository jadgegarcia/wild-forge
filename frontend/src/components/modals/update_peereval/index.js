import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import ControlInput from '../../controlinput';
import { isObjectEmpty } from '../../../utils/object';
import { usePeerEvals } from '../../../hooks';

import './index.scss';

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'This field is required.';
  } else if (values.name.length > 50) {
    errors.name = 'The maximum length of this field is 50 characters.';
  }

  if (!values.forms_link) {
    errors.forms_link = 'This field is required.';
  } else if (values.forms_link.length > 500) {
    errors.forms_link = 'The maximum length of this field is 500 characters.';
  }

  if (!values.sheet_link) {
    errors.sheet_link = 'This field is required.';
  } else if (values.sheet_link.length > 500) {
    errors.sheet_link = 'The maximum length of this field is 50 characters.';
  }

  return errors;
};

function UpdatePeerEvalForm({ initValues, visible, handleModal }) {
  const { updatePeerEval, isProcessing } = usePeerEvals();

  return (
    <Dialog className="create-modal p-5" visible={visible} onHide={handleModal} showHeader={false}>
      <div className="d-flex flex-column">
        <div className="fw-bold text-center fs-5">Update PeerEval</div>
        <Formik
          initialValues={{
            name: initValues.name,
            forms_link: initValues.forms_link,
            sheet_link: initValues.sheet_link,
          }}
          onSubmit={async (values, { setErrors }) => {
            const errors = validate(values);
            if (!isObjectEmpty(errors)) {
              setErrors(errors);
              return;
            }

            const updatePeerEvalCallbacks = {
              updated: async ({ retrievedPeerEval }) => {
                window.location.reload();
              },
              invalidFields: () =>
                setErrors({
                  overall: 'Invalid peer eval.',
                }),
              internalError: () =>
                setErrors({
                  overall: 'Oops, something went wrong.',
                }),
            };

            // Create Class
            await updatePeerEval(initValues.id, {
              name: values.name,
              forms_link: values.forms_link,
              sheet_link: values.sheet_link,
              callbacks: updatePeerEvalCallbacks,
            });
          }}
        >
          {({ errors, values, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <ControlInput
                name="name"
                label="PeerEval Name"
                className="yellow-on-focus"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                error={errors.name}
              />
              <ControlInput
                name="forms_link"
                label="Google forms link"
                className="yellow-on-focus"
                value={values.forms_link}
                onChange={(e) => setFieldValue('forms_link', e.target.value)}
                error={errors.forms_link}
              />
              <ControlInput
                name="sheet_link"
                label="Google sheet link"
                className="yellow-on-focus"
                value={values.sheet_link}
                onChange={(e) => setFieldValue('sheet_link', e.target.value)}
                error={errors.sheet_link}
              />
              <div className="d-flex flex-row justify-content-center">
                <button
                  aria-label="Close Modal"
                  className="btn btn-secondary btn-lg ms-auto fw-semibold my-3 mx-auto"
                  onClick={handleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-yellow-primary btn-lg ms-auto fw-semibold my-3 mx-auto"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
}

UpdatePeerEvalForm.defaultProps = {
  visible: false,
  initValues: null,
  handleModal: () => {},
};

UpdatePeerEvalForm.propTypes = {
  visible: PropTypes.bool,
  initValues: PropTypes.objectOf(PropTypes.any),
  handleModal: PropTypes.func,
};

export default UpdatePeerEvalForm;
