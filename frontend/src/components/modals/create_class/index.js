import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import ControlInput from '../../controlinput';
import { isObjectEmpty } from '../../../utils/object';
import { copyToClipBoard } from '../../../utils/copyToClipBoard';
import { useCreateClass } from '../../../hooks';
import './index.scss';

const validate = (values) => {
  const errors = {};

  if (!values.course_name) {
    errors.course_name = 'This field is required.';
  } else if (values.course_name.length > 50) {
    errors.course_name = 'The maximum length of this field is 50 characters.';
  }

  if (!values.sections) {
    errors.sections = 'This field is required.';
  } else if (values.sections.length > 50) {
    errors.sections = 'The maximum length of this field is 50 characters.';
  }

  if (!values.schedule) {
    errors.schedule = 'This field is required.';
  } else if (values.schedule.length > 50) {
    errors.schedule = 'The maximum length of this field is 50 characters.';
  } else if (!values.schedule.match(/^[0-9]{1,2}:[0-9]{2}[AP]M - [0-9]{1,2}:[0-9]{2}[AP]M$/)) {
    errors.schedule = 'The format of this field is invalid.';
  }

  if (!values.max_teams_members) {
    errors.max_teams_members = 'This field is required.';
  } else if (typeof values.max_teams_members !== 'number') {
    errors.max_teams_members = 'This field must be a number.';
  }

  return errors;
};

function CreateClass({ visible, handleModal }) {
  const [showCode, setShowCode] = useState(false);
  const [classCode, setClassCode] = useState('');

  const { createClass } = useCreateClass();

  const openShowCodeModal = () => {
    setShowCode(true);
  };

  const closeShowCodeModal = () => {
    setShowCode(false);
    window.location.reload();
  };

  const handleCopyCode = (code) => {
    try {
      copyToClipBoard(code);
    } catch (error) {
      console.error(error);
    }

    setShowCode(false);
    handleModal();
    window.location.reload();
  };

  const renderShowCode = (code) => (
    <Dialog
      className="code-modal p-3"
      visible={showCode}
      onHide={closeShowCodeModal}
      showHeader={false}
    >
      <span className="fw-bold fs-6">Join Code</span>
      <div className="d-flex flex-row py-2 justify-content-center">
        <div className="code-content text-center p-2">{code}</div>
        <button
          className="btn btn-yellow-primary btn-lg fw-semibold ms-4"
          onClick={() => handleCopyCode(code)}
        >
          Copy
        </button>
      </div>
    </Dialog>
  );

  return (
    <>
      <Dialog
        className="create-modal p-5"
        visible={visible}
        onHide={handleModal}
        showHeader={false}
      >
        <div className="d-flex flex-column">
          <div className="fw-bold text-center fs-5">Create Class</div>
          <Formik
            initialValues={{
              course_name: '',
              sections: '',
              schedule: '',
              max_teams_members: 5,
            }}
            onSubmit={async (values, { setErrors }) => {
              const errors = validate(values);
              if (!isObjectEmpty(errors)) {
                setErrors(errors);
                return;
              }

              const createClassCallbacks = {
                created: async ({ retrievedClass }) => {
                  if (retrievedClass) {
                    setClassCode(retrievedClass.class_code);
                    openShowCodeModal();
                  }
                },
                invalidFields: () =>
                  setErrors({
                    overall: 'Invalid class name.',
                  }),
                internalError: () =>
                  setErrors({
                    overall: 'Oops, something went wrong.',
                  }),
              };

              // Create Class
              await createClass({
                course_name: values.course_name,
                sections: values.sections,
                schedule: values.schedule,
                max_teams_members: values.max_teams_members,
                callbacks: createClassCallbacks,
              });
            }}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ControlInput
                  name="course_name"
                  label="Course Name"
                  className="yellow-on-focus"
                  value={values.course_name}
                  onChange={(e) => setFieldValue('course_name', e.target.value)}
                  error={errors.course_name}
                />
                <div>
                  <ControlInput
                    name="sections"
                    label="Class Sections"
                    className="yellow-on-focus"
                    value={values.sections}
                    onChange={(e) => setFieldValue('sections', e.target.value)}
                    error={errors.sections}
                  />
                  <div className="format-instructions">e.g F1-F2, E2, Honesty</div>
                  <ControlInput
                    name="schedule"
                    label="Schedule"
                    className="yellow-on-focus"
                    value={values.schedule}
                    onChange={(e) => setFieldValue('schedule', e.target.value)}
                    error={errors.schedule}
                  />
                  <div className="format-instructions">Sample Format: 1:00PM - 2:00PM</div>
                  <ControlInput
                    name="max_teams_members"
                    label="Max Team Members"
                    className="yellow-on-focus"
                    value={values.max_teams_members}
                    type="number"
                    onChange={(e) =>
                      setFieldValue('max_teams_members', parseInt(e.target.value, 10))
                    }
                    error={errors.max_teams_members}
                  />
                </div>
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
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Dialog>
      {showCode && renderShowCode(classCode)}
    </>
  );
}

CreateClass.defaultProps = {
  visible: false,
  handleModal: () => {},
};

CreateClass.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
};

export default CreateClass;
