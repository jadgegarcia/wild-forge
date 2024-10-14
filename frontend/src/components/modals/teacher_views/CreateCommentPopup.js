import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useActivityComments } from '../../../hooks';

const CreateCommentPopup = ({ show, handleClose, data }) => {
  const navigate = useNavigate();

  const [commentData, setCommentData] = useState({
    activity_id: 0,
    user_id: 0,
    comment: '',
  });

  const { addComment } = useActivityComments(data.id);
  const { user } = useOutletContext();

  // Handle input changes in the comment form
  const handleChange = (e) => {
    const { name, value } = e.target;
    commentData.activity_id = data.id;
    commentData.user_id = user.user_id;
    setCommentData({
      ...commentData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if commentData.comment is empty
    // if (commentData.comment.trim().length === 0) {
    //     alert("Please enter a comment.");
    //     return;
    // }

    try {
      const response = await addComment(commentData);
      // must add a conditional statement to check if response is successful

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
        <Modal.Title className="fs-6 fw-bold">Add Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column gap-3 was-validated" id="form" onSubmit={handleSubmit}>
          <div>
            <Form.Label htmlFor="validationTextarea" className="form-label">
              Comment
            </Form.Label>
            <Form.Control
              className="form-control is-invalid"
              as="textarea"
              id="validationTextarea"
              placeholder="Write comment here."
              name="comment"
              required
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-end">
            <Button variant="btn btn-activity-primary" type="submit" id="form">
              Add Comment
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCommentPopup;
