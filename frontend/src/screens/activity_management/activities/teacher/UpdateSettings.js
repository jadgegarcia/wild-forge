import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import useActivityCriteriaSettings from '../../../../hooks/useActivityCriteriaSettings';

const UpdateSettings = () => {
  const navigate = useNavigate();
  const { classId } = useOutletContext();
  const [settingsData, setSettingsData] = useState({
    classroom_id: classId,
    api_key: '',
  });

  const { isLoading, settings, createActivityCriteriaSettings, updateActivityCriteriaSettings } = useActivityCriteriaSettings(classId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData({
      ...settingsData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['api_key'];
    const isEmptyField = requiredFields.some((field) => !settingsData[field]);

    if (isEmptyField) {
      window.alert('Please fill in all required fields.');
      return;
    }

    const isConfirmed = window.confirm('Please confirm if you want to update the settings');

    if (isConfirmed) {
      try {
        await createActivityCriteriaSettings(settingsData);
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Update canceled');
    }
  };

  return (
    <div className="container-md">
      <div className="container-md d-flex flex-column gap-3 mt-5 pr-3 pl-3">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center gap-2">
            <span className="nav-item nav-link" onClick={() => navigate(-1)}>
              <FiChevronLeft />
            </span>
            <h4 className="fw-bold m-0">API Settings</h4>
          </div>
        </div>
        <hr className="text-dark" />
        <Form className="was-validated" id="form" onSubmit={handleSubmit}>
          {/* API Key */}
          <div className="mb-3">
            <label htmlFor="api_key" className="form-label">
              API Key
            </label>
            <Form.Control
              className="form-control is-invalid"
              as="input"
              type="text"
              id="api_key"
              name="api_key"
              required
              value={settingsData.api_key}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-success" type="submit">
            Save Settings
          </button>
        </Form>
      </div>
    </div>
  );
};

export default UpdateSettings;
