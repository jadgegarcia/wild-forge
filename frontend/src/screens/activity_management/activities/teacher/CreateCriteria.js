import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import useActivityCriteria from '../../../../hooks/useActivityCriteria';

const CreateCriteria = () => {
  const navigate = useNavigate();
  const { classId } = useOutletContext();
  const [activityCriteriaData, setActivityCriteriaData] = useState({
    classroom_id: classId,
    name: '',
    description: '',
  });

  const { createActivityCriteria } = useActivityCriteria(classId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityCriteriaData({
      ...activityCriteriaData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'description'];
    const isEmptyField = requiredFields.some((field) => !activityCriteriaData[field]);

    if (isEmptyField) {
      window.alert('Please fill in all required fields.');
      return;
    }

    const isConfirmed = window.confirm('Please confirm if you want to create this activity criteria');

    if (isConfirmed) {
      try {
        await createActivityCriteria(activityCriteriaData);
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Creation canceled');
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
            <h4 className="fw-bold m-0">Create Criteria</h4>
          </div>
        </div>
        <hr className="text-dark" />
        <Form className="was-validated" id="form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <Form.Control
              className="form-control is-invalid"
              as="input"
              type="text"
              id="name"
              name="name"
              required
              value={activityCriteriaData.name}
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
              value={activityCriteriaData.description}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-success" type="submit">
            Create Criteria
          </button>
        </Form>
      </div>
    </div>
  );
};

export default CreateCriteria;
