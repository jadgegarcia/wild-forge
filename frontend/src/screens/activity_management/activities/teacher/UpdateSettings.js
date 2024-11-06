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

  const [settingsId, setSettingsId] = useState(null);

  const { isLoading, settings, getActivityCriteriaSettingsById, updateActivityCriteriaSettings } = useActivityCriteriaSettings(classId);

  useEffect(() => {
    const fetchSettings = async () => {
      if (settings.length > 0 && !settingsId) {
        const firstSetting = await getActivityCriteriaSettingsById(settings[0].id);
        if (firstSetting.success) {
          setSettingsData((prevData) => ({
            ...prevData,
            api_key: firstSetting.data.api_key,
          }));
          setSettingsId(firstSetting.data.id);
        }
      }
    };
  
    fetchSettings();
  }, [settings, settingsId, getActivityCriteriaSettingsById]);
  

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
        await updateActivityCriteriaSettings(settingsId, settingsData);
        navigate(0);
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

        <div className="mb-3">
          <strong>Current API Key: {settingsData.api_key}</strong>
        </div>

        <Form className="was-validated" id="form" onSubmit={handleSubmit}>
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
              value={settingsData.api_key}
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
