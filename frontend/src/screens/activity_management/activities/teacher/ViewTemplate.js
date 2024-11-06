import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useActivity, useTeams, useActivityTemplate } from '../../../../hooks';
import { UpdateTemplatePopup } from '../../../../components/modals/teacher_views';

const ViewTemplate = () => {
  const navigate = useNavigate();
  const { classId } = useOutletContext();
  const { teams } = useTeams(classId);
  const { templateId } = useParams();
  const { template, deleteTemplate } = useActivityTemplate(templateId);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const { createFromTemplate } = useActivity(classId, null, null);

  const [templateData, setTemplateData] = useState({
    course_name: '',
    title: '',
    description: '',
  });

  const [activityData, setActivityData] = useState({
    template_id: 0,
    team_ids: [],
    due_date: '',
    evaluation: 0,
    total_score: 0,
    class_id: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData({
      ...activityData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm('Please confirm if you want to create this activity');

    if (isConfirmed) {
      try {
        await createFromTemplate(activityData);
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    } else {
      // The user canceled the deletion
      console.log('Creation canceled');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this template?');

    if (isConfirmed) {
      try {
        await deleteTemplate(templateId);
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    } else {
      // The user canceled the deletion
      console.log('Deletion canceled');
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

    // Update templateData with the selected teams
    setActivityData((prevState) => ({
      ...prevState,
      team_ids: _selectedTeams,
    }));
  };

  useEffect(() => {
    if (template) {
      setTemplateData({
        course_name: template.course_name,
        title: template.title,
        description: template.description,
      });

      setActivityData((prevState) => ({
        ...prevState,
        template_id: template.id,
        class_id: classId,
      }));
    }
  }, [template]);

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
            <h4 className="fw-bold m-0">{templateData.title}</h4>
          </div>
          <div className="d-flex flex-row gap-3 ">
            <button
              className="btn btn-activity-secondary btn-block fw-bold bw-3 m-0"
              onClick={handleShowModal}
            >
              Edit Template
            </button>
            <button className="btn btn-danger btn-block fw-bold bw-3 m-0 " onClick={handleDelete}>
              Delete Template
            </button>
          </div>
        </div>
        <hr className="text-dark" />
        <Form className="d-flex flex-column gap-3 was-validated" id="form" onSubmit={handleSubmit}>
          {/* title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={templateData.title}
              onChange={handleChange}
              disabled
            />
          </div>
          {/* desc */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={templateData.description}
              onChange={handleChange}
              disabled
            />
          </div>
          {/* course_name */}
          <div className="mb-3">
            <label htmlFor="course_name" className="form-label">
              Course Name
            </label>
            <textarea
              className="form-control"
              id="courseName"
              name="courseName"
              value={templateData.course_name}
              onChange={handleChange}
              disabled
            />
          </div>
          <hr className="text-dark" />
          {/* team */}
          <div className="mb-3">
            <label htmlFor="team_ids" className="form-label">
              Team
            </label>
            <Select
              defaultValue={selectedTeams}
              onChange={handleTeamChange}
              options={teamOptions}
              isMulti
              required
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
          <div className="d-flex justify-content-end">
            <Button variant="btn btn-activity-primary" type="submit" id="form">
              Create Activity
            </Button>
          </div>
        </Form>
        <UpdateTemplatePopup show={showModal} handleClose={handleCloseModal} data={templateData} />
      </div>
    </div>
  );
};

export default ViewTemplate;
