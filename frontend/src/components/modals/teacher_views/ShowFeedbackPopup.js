import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ShowFeedbackPopup = ({ show, handleClose, data }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchChange = (e) => {
    setIsSwitchOn(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleClose();
    } catch (error) {
      console.error('Error updating feedback:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{data}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Feedback Form */}
        <Form className="d-flex flex-column gap-3 was-validated" id="form" onSubmit={handleSubmit}>
          <Form.Group controlId="description-input">
            {/* Flexbox container for the label and switch */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">Feedback</Form.Label>
              
              <div className="d-flex justify-content-between align-items-center mb-2">
              <span className={`mr-2 ${isSwitchOn ? "text-success" : "text-danger"}`}>
                {isSwitchOn ? "Checked" : "Unchecked"}
              </span>
                {/* The switch is now to the right */}
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
              value={data}
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
