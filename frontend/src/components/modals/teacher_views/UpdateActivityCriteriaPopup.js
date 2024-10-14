import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useActivityCriteria from '../../../hooks/useActivityCriteria';

const UpdateActivityCriteriaPopup = ({ show, handleClose, classId, teamId, criteriaId, data }) => {
  const navigate = useNavigate();

  // Hook to update Activity Criteria
  const { updateActivityCriteria } = useActivityCriteria(criteriaId);

  // Initialize the state with the passed data (criteria)
  const [updateCriteriaData, setUpdateCriteriaData] = useState({
    ...data,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateCriteriaData({
      ...updateCriteriaData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields (name and description) are filled
    const requiredFields = ['name', 'description'];
    const isEmptyField = requiredFields.some((field) => !updateCriteriaData[field]);

    if (isEmptyField) {
      window.alert('Please fill in all required fields.');
      return;
    }

    try {
      // Update the Activity Criteria
      await updateActivityCriteria(updateCriteriaData);

      // Close modal and refresh page
      handleClose();
      navigate(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">Update Activity Criteria</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="d-flex flex-column gap-3 was-validated" id="form" onSubmit={handleSubmit}>
          {/* Name Input */}
          <Form.Group controlId="name-input">
            <Form.Label className="form-label">Name</Form.Label>
            <Form.Control
              className="form-control is-invalid"
              as="input"
              type="text"
              name="name"
              value={updateCriteriaData?.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Description Input */}
          <Form.Group controlId="description-input">
            <Form.Label>Description</Form.Label>
            <Form.Control
              className="form-control is-invalid"
              as="textarea"
              rows={3}
              name="description"
              value={updateCriteriaData?.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Submit Button */}
          <div className="d-flex justify-content-end">
            <Button variant="btn btn-activity-primary" type="submit">
              Update Criteria
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateActivityCriteriaPopup;
