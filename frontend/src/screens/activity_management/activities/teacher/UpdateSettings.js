import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import useActivityCriteriaSettings from '../../../../hooks/useActivityCriteriaSettings';

const UpdateSettings = () => {
  const navigate = useNavigate();
  const { classId } = useOutletContext();

  // Initial state for settingsData
  const [settingsData, setSettingsData] = useState({
    classroom_id: classId,
    api_key: '',
  });

  // State to hold the ID of the existing settings
  const [settingsId, setSettingsId] = useState(null);

  // Fetching settings using a custom hook
  const { isLoading, settings, updateActivityCriteriaSettings } = useActivityCriteriaSettings(classId);

  // Update settingsData when settings are loaded
  useEffect(() => {
    if (settings && settings.length > 0) {
      // Assuming settings[0] is the first record you want to display
      setSettingsData((prevData) => ({
        ...prevData,
        api_key: settings[0].api_key, // Use the first record's API key
      }));
      setSettingsId(settings[0].id); // Save the ID for update
    }
  }, [settings]); // Runs when settings are fetched

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

    if (isConfirmed && settingsId) {
      try {
        // Update the existing settings in the backend
        await updateActivityCriteriaSettings(settingsId, settingsData);
        navigate(-1); // Navigate back to the previous page after updating
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

        {/* Show the current API key above the input field */}
        <div className="mb-3">
          <strong>Current API Key: {settingsData.api_key}</strong>
        </div>

        <Form className="was-validated" id="form" onSubmit={handleSubmit}>
          {/* API Key Input */}
          <div className="mb-3">
            <label htmlFor="api_key" className="form-label">
              Update API Key
            </label>
            <Form.Control
              className="form-control"
              as="input"
              type="text"
              id="api_key"
              name="api_key"
              required
              value={settingsData.api_key} // Controlled component
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-success" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default UpdateSettings;
