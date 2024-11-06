import React from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { useOutletContext } from 'react-router-dom';
import { Formik } from 'formik';
import ControlInput from '../../controlinput';
import { isObjectEmpty } from '../../../utils/object';
import ControlTextArea from '../../controltextarea';
import { useTeams } from '../../../hooks';

import './index.scss';

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'This field is required.';
  } else if (values.name.length > 50) {
    errors.name = 'The maximum length of this field is 50 characters.';
  }

  if (!values.description) {
    errors.description = 'This field is required.';
  }

  return errors;
};

function UpdateTeam({ visible, handleModal, teamData }) {
  const { classId } = useOutletContext();
  const { updateTeam } = useTeams(classId);

  return (
    <Dialog className="hiring-post-modal" visible={visible} onHide={handleModal} showHeader={false}>
      <div className="d-grid gap-3 p-3">
        <button aria-label="Close Modal" className="btn btn-close ms-auto" onClick={handleModal} />
        <div className="px-3">
          <div className="text-center fs-4 fw-bold">Update Team</div>
          <Formik
            initialValues={{
              name: teamData.name,
              description: teamData.description,
            }}
            onSubmit={async (values, { setErrors }) => {
              const errors = validate(values);
              if (!isObjectEmpty(errors)) {
                setErrors(errors);
                return;
              }

              const updateTeamCallbacks = {
                updated: async ({ retrievedTeam }) => {
                  if (retrievedTeam) {
                    Swal.fire('Team Updated Successfully.');
                    window.location.reload();
                  }
                },
                invalidFields: () => {
                  errors.name = 'Invalid team name.';
                  setErrors(errors);
                },
                internalError: () => {
                  Swal.fire('Internal Error: Oops, something went wrong. Please try again.');
                },
              };
              console.log('values', values.name, values.description);

              // Update Team
              await updateTeam(teamData.id, {
                name: values.name,
                description: values.description,
                callbacks: updateTeamCallbacks,
              });
            }}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ControlInput
                  name="name"
                  label="Team Name"
                  className="yellow-on-focus"
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  error={errors.name}
                />
                <ControlTextArea
                  name="description"
                  label="Team Description"
                  className="yellow-on-focus"
                  value={values.description}
                  onChange={(e) => setFieldValue('description', e.target.value)}
                  error={errors.description}
                />
                <div className="d-flex flex-row justify-content-center pb-3 pt-3">
                  <button
                    className="btn btn-cancel-secondary fw-semibold mx-auto"
                    onClick={handleModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-yellow-primary btn-create-team-modal mx-auto fw-semibold"
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  );
}

UpdateTeam.defaultProps = {
  visible: false,
  handleModal: () => {},
  teamData: {},
};

UpdateTeam.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
  teamData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default UpdateTeam;
