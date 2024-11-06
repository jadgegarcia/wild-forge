import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '../../../hooks';

const CreateEvaluationPopup = ({ show, handleClose, classId, teamId, activityId, data }) => {
  const navigate = useNavigate();
  const [evaluationData, setEvaluationData] = useState({
    evaluation: data?.evaluation,
  });

  // console.log(classId, activityId, teamId);
  const { addEvaluation } = useActivities(classId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluationData({
      ...evaluationData,
      [name]: parseInt(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the required fields are empty
    const requiredFields = ['evaluation'];
    const isEmptyField = requiredFields.some((field) => !evaluationData[field]);

    if (isEmptyField) {
      window.alert('Please fill in all required fields.');
      return;
    }

    try {
      console.log(evaluationData);
      await addEvaluation(teamId, activityId, evaluationData);
      console.log('Evaluation added successfully!');
      handleClose();
      navigate(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">Add Evaluation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="d-flex flex-column gap-3">
          <Form.Group controlId="evaluation-input">
            <Form.Label>Evaluation</Form.Label>

            <Form.Control
              type="number"
              name="evaluation"
              value={evaluationData?.evaluation}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>

        <Button variant="success" onClick={handleSubmit}>
          Add Evaluation
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateEvaluationPopup;
