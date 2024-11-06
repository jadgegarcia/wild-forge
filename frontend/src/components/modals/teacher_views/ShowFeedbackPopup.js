import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import useActivityCriteriaRelation from '../../../hooks/useActivityCriteriaRelation';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const ShowFeedbackPopup = ({ show, handleClose, data }) => {
  const { classId } = useOutletContext();
  const { activityId, teamId } = useParams();
  const navigate = useNavigate();
  const [isSwitchOn, setIsSwitchOn] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { updateActivityCriteriaRelation } = useActivityCriteriaRelation(data.id);

  console.log("Data in Popup:", JSON.stringify(data, null, 2));

  useEffect(() => {
    if (show) {
      setFeedback(data.criteria_feedback); // Initialize feedback with data.feedback
      setIsSwitchOn(data.criteria_status); // Initialize switch with the existing status
    }
  }, [show, data]);

  const handleSwitchChange = (e) => {
    setIsSwitchOn(e.target.checked ? 1 : 0); // Set to 1 or 0 based on the toggle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      id: data.id,
      strictness: data.strictness, // Add this field if it exists in data
      activity_criteria_status: isSwitchOn,
      activity_criteria_feedback: feedback,
      activity: data.activity_id, // Ensure this is set
      activity_criteria: data.criteria_id, // Ensure this is set
    };

    console.log("Updated data: ", JSON.stringify(updatedData, null, 2));

    try {
      await updateActivityCriteriaRelation(data.id, updatedData); // Call the update function from the hook
      navigate(0);
      await handleClose(); // Close the modal
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{data.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column gap-3 was-validated" id="form" onSubmit={handleSubmit}>
          <Form.Group controlId="description-input">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">Feedback</Form.Label>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className={`mr-2 ${isSwitchOn ? "text-success" : "text-danger"}`}>
                  {isSwitchOn ? "Checked" : "Unchecked"}
                </span>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={isSwitchOn}
                  onChange={handleSwitchChange}
                  className="ms-3"
                />
              </div>
            </div>
            <Form.Control
              className="form-control is-invalid"
              as="textarea"
              name="feedback"
              required
              value={feedback} // Bind to the local state
              onChange={(e) => setFeedback(e.target.value)} // Update local state
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="btn btn-activity-primary" type="submit" id="form">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ShowFeedbackPopup;
