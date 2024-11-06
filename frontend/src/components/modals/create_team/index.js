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

  if (!values.team_name) {
    errors.team_name = 'This field is required.';
  } else if (values.team_name.length > 50) {
    errors.team_name = 'The maximum length of this field is 50 characters.';
  }

  if (!values.team_description) {
    errors.team_description = 'This field is required.';
  }

  return errors;
};

function CreateTeam({ visible, handleModal }) {
  const { classId } = useOutletContext();
  const { createTeam } = useTeams(classId);

  return (
    <Dialog className="hiring-post-modal" visible={visible} onHide={handleModal} showHeader={false}>
      <div className="d-grid gap-3 p-3">
        <button aria-label="Close Modal" className="btn btn-close ms-auto" onClick={handleModal} />
        <div className="px-3">
          <div className="text-center fs-4 fw-bold">Team Creation</div>
          <Formik
            initialValues={{
              team_name: '',
              team_description: '',
            }}
            onSubmit={async (values, { setErrors }) => {
              const errors = validate(values);
              if (!isObjectEmpty(errors)) {
                setErrors(errors);
                return;
              }

              const createTeamCallbacks = {
                created: async ({ retrievedTeam }) => {
                  if (retrievedTeam) {
                    Swal.fire('Team Created Successfully.').then(() => {
                      window.location.reload();
                    });
                  }
                },
                invalidFields: () => {
                  errors.team_name = 'Invalid team name.';
                  setErrors(errors);
                },
                internalError: () => {
                  Swal.fire('Internal Error: Oops, something went wrong. Please try again.');
                },
              };

              // Create Team
              await createTeam({
                name: values.team_name,
                description: values.team_description,
                callbacks: createTeamCallbacks,
              });
            }}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ControlInput
                  name="team_name"
                  label="Team Name"
                  className="yellow-on-focus"
                  placeholder="Enter Team Name"
                  value={values.team_name}
                  onChange={(e) => setFieldValue('team_name', e.target.value)}
                  error={errors.team_name}
                />
                <ControlTextArea
                  name="team_description"
                  label="Team Description"
                  className="yellow-on-focus"
                  placeholder="Enter Team Description"
                  value={values.team_description}
                  onChange={(e) => setFieldValue('team_description', e.target.value)}
                  error={errors.team_description}
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
                    Create
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

CreateTeam.defaultProps = {
  visible: false,
  handleModal: () => {},
};

CreateTeam.propTypes = {
  visible: PropTypes.bool,
  handleModal: PropTypes.func,
};

export default CreateTeam;
