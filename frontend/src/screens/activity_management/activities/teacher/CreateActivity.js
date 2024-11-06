import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useActivity, useTeams } from '../../../../hooks';
import useActivityCriteria from '../../../../hooks/useActivityCriteria';

const CreateActivity = () => {
  const navigate = useNavigate();
  const { classId } = useOutletContext();
  const { teams } = useTeams(classId);

  const [selectedTeams, setSelectedTeams] = useState([]);
  
  // -------------------------START CRITERIA---------------------------------- //
  const { activityCriterias } = useActivityCriteria();
  const [criteriaList, setCriteriaList] = useState([]);
  const [activityCriteriaOptions, setActivityCriteriaOptions] = useState([]);
  const [strictnessValues, setStrictnessValues] = useState([0]); // Default value for strictness
  const [statusValues, setStatusValues] = useState([0]);
  const [feedbackValues, setFeedbackValues] = useState([]);
  // -------------------------END CRITERIA---------------------------------- //

  console.log("activityCriterias: ", activityCriterias);
  console.log("teams: ", teams);

  const [teamOptions, setTeamOptions] = useState([]);

  const [activityData, setActivityData] = useState({
    classroom_id: classId,
    team_id: [],
    activityCriteria_id: [],
    title: '',
    description: '',
    instruction: '',
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
      // Prepare data to send to the backend
      const activityDataToSend = {
        ...activityData,
        activityCriteria_id: criteriaList,
        strictness_levels: strictnessValues, // Add the strictness values here
        criteria_status: statusValues,
        criteria_feedback: feedbackValues,
      };

      try {
        await createActivity(activityDataToSend);
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    } else {
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

    setActivityData((prevState) => ({
      ...prevState,
      team_id: _selectedTeams,
    }));
  };

  const handleCriteriaChange = (selectedOption, index) => {
    const updatedCriteriaList = [...criteriaList];
    updatedCriteriaList[index] = selectedOption.value;

    setCriteriaList(updatedCriteriaList);

    setActivityData((prevState) => ({
      ...prevState,
      activityCriteria_id: updatedCriteriaList,
    }));
  };

  const addCriteria = () => {
    setCriteriaList((prevList) => [...prevList, '']);
    setStrictnessValues((prevValues) => [...prevValues, 0]); // Add a default strictness level
    setStatusValues((prevValues) => [...prevValues, 0]);
    setFeedbackValues((prevValues) => [...prevValues, "NO FEEDBACK"]);
  };

  const removeCriteria = (index) => {
    const updatedCriteriaList = criteriaList.filter((_, i) => i !== index);
    const updatedStrictnessValues = strictnessValues.filter((_, i) => i !== index);
    const updatedStatusValues = statusValues.filter((_, i) => i !== index);
    const updatedFeedbackValues = statusValues.filter((_, i) => i !== index);

    setCriteriaList(updatedCriteriaList);
    setStrictnessValues(updatedStrictnessValues);
    setStatusValues(updatedStatusValues);
    setFeedbackValues(updatedFeedbackValues);

    setActivityData((prevState) => ({
      ...prevState,
      activityCriteria_id: updatedCriteriaList,
    }));
  };

  const handleStrictnessChange = (value, index) => {
    const updatedValues = [...strictnessValues];
    updatedValues[index] = value;
    setStrictnessValues(updatedValues);
  };

  useEffect(() => {
    if (teams) {
      const options = teams.map((team) => ({ value: team.id, label: team.name }));
      options.unshift({ value: 'all', label: 'select all' });
      setTeamOptions(options);
    }

    if (activityCriterias) {
      const options = activityCriterias.map((activityCriteria) => ({
        value: activityCriteria.id,
        label: activityCriteria.name,
      }));
      setActivityCriteriaOptions(options);
    }
  }, [teams, activityCriterias]);

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
          <div className="d-flex flex-row gap-3">
            <button
              className="btn btn-activity-secondary btn-block fw-bold bw-3 m-0"
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
          {/* Title */}
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
          {/* Description */}
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
          <div className="mb-3">
            <label htmlFor="instruction" className="form-label">
              Instruction
            </label>
            <textarea
              className="form-control is-invalid"
              required
              id="instruction"
              name="instruction"
              value={activityData.instruction}
              onChange={handleChange}
            />
          </div>
          {/* Team */}
          <div className="mb-3">
            <label htmlFor="team_id" className="form-label">
              Team
            </label>
            <Select
              className="form-control"
              isMulti
              required
              id="team_id"
              name="team_id"
              defaultValue={selectedTeams}
              options={teamOptions}
              onChange={handleTeamChange}
            />
          </div>

          {/* -------------------------START CRITERIA---------------------------------- */}
          Criteria
          <div className="container mb-3">
            <div className="row">
              {criteriaList.map((criteria, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <Select
                      className="form-control me-2 flex-grow-1"
                      id={`criteria-${index}`}
                      name={`criteria-${index}`}
                      value={activityCriteriaOptions.find(option => option.value === criteria) || null}
                      options={activityCriteriaOptions}
                      onChange={(selectedOption) => handleCriteriaChange(selectedOption, index)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeCriteria(index)}
                    >
                      Remove
                    </button>
                  </div>
                  {/* Strictness */}
                  <div className="mb-3">
                    <label htmlFor={`strictness-${index}`} className="form-label">
                      Strictness of Criteria
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      id={`strictness-${index}`}
                      min="1"
                      max="10"
                      value={strictnessValues[index]}
                      onChange={(e) => handleStrictnessChange(e.target.value, index)}
                    />
                    <div>Strictness Level: {strictnessValues[index]}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-primary mt-3" onClick={addCriteria}>
              Add Criteria
            </button>
          </div>
          {/* -------------------------END CRITERIA---------------------------------- */}

          {/* Due Date */}
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
          {/* Total Score */}
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
