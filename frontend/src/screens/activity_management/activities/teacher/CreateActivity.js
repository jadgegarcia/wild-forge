import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useActivity, useTeams } from '../../../../hooks';

const CreateActivity = () => {
  const navigate = useNavigate();
  const { classId } = useOutletContext();
  const { teams } = useTeams(classId);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const [activityData, setActivityData] = useState({
    classroom_id: classId,
    team_id: [],
    title: '',
    description: '',
    submission_status: false,
    due_date: '',
    evaluation: 0,
    total_score: 0,
  });

  const { createActivity } = useActivity(classId, null, null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData({
      ...activityData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['title', 'description', 'due_date', 'total_score'];
    const isEmptyField = requiredFields.some((field) => !activityData[field]);

    if (isEmptyField) {
      window.alert('Please fill in all required fields.');
      return;
    }

    const isConfirmed = window.confirm('Please confirm if you want to create this activity');

    if (isConfirmed) {
      try {
        await createActivity(activityData);
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    } else {
      // The user canceled the deletion
      console.log('Creation canceled');
    }
  };

  const handleTeamChange = (selectedOptions) => {
    let _selectedTeams;
    if (selectedOptions.some((option) => option.value === 'all')) {
      _selectedTeams = teamOptions
        .filter((option) => option.value !== 'all')
        .map((option) => option.value);
    } else {
      _selectedTeams = selectedOptions.map((option) => option.value);
    }

    setSelectedTeams(_selectedTeams);

    // Update activityData with the selected teams
    setActivityData((prevState) => ({
      ...prevState,
      team_id: _selectedTeams,
    }));
  };

  useEffect(() => {
    if (teams) {
      const options = teams.map((team) => ({ value: team.id, label: team.name }));
      options.unshift({ value: 'all', label: 'select all' });
      setTeamOptions(options);
    }
  }, [teams]);

  return (
    <div className="container-md">
      <div className="container-md d-flex flex-column gap-3 mt-5 pr-3 pl-3">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center gap-2">
            <span className="nav-item nav-link" onClick={() => navigate(-1)}>
              <FiChevronLeft />
            </span>
            <h4 className="fw-bold m-0">Create Activity</h4>
          </div>
          <div className="d-flex flex-row gap-3 ">
            <button
              className="btn btn-activity-secondary btn-block fw-bold bw-3 m-0 "
              onClick={() => {
                navigate(`/classes/${classId}/activities/templates`);
              }}
            >
              Use Templates
            </button>
          </div>
        </div>
        <hr className="text-dark" />
        <Form className="was-validated" id="form" onSubmit={handleSubmit}>
          {/* title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <Form.Control
              className="form-control is-invalid"
              as="input"
              type="text"
              id="title"
              name="title"
              required
              value={activityData.title}
              onChange={handleChange}
            />
          </div>
          {/* desc */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control is-invalid"
              required
              id="description"
              name="description"
              value={activityData.description}
              onChange={handleChange}
            />
          </div>
          {/* team */}
          <div className="mb-3">
            <label htmlFor="team_id" className="form-label">
              Team
            </label>
            <Select
              className="form-control"
              isMulti
              required
              id="description"
              name="description"
              defaultValue={selectedTeams}
              options={teamOptions}
              onChange={handleTeamChange}
            />
          </div>
          {/* date */}
          <div className="mb-3">
            <label htmlFor="due_date" className="form-label">
              Due Date
            </label>
            <input
              className="form-control is-invalid"
              type="date"
              id="due_date"
              name="due_date"
              required
              value={activityData.due_date}
              onChange={handleChange}
            />
          </div>
          {/* score */}
          <div className="mb-3">
            <label htmlFor="total_score" className="form-label">
              Total Score
            </label>
            <input
              className="form-control is-invalid"
              type="number"
              id="total_score"
              name="total_score"
              required
              value={activityData.total_score ? activityData.total_score : ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-activity-primary">
            Create Activity
          </button>
        </Form>
      </div>
    </div>
  );
};

export default CreateActivity;
