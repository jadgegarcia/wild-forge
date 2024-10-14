import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useActivityComment } from '../../../hooks';

const UpdateCommentPopup = ({ show, handleClose, data, commentId }) => {
  const { user } = useOutletContext();
  const { comment, updateComment } = useActivityComment(commentId);

  const navigate = useNavigate();

  const [commentData, setCommentData] = useState({
    activity_id: 0,
    user_id: 0,
    comment: '',
  });

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
    try {
      await updateComment(commentData);
      // must add a conditional statement to check if response is successful

      console.log('Evaluation added successfully!');
      handleClose();
      navigate(0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (comment) {
      setCommentData({
        activity_id: comment.activity?.id,
        user_id: comment.user?.id,
        comment: comment.comment,
      });
    }
  }, [comment]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">Edit Comment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="d-flex flex-column gap-3 was-validated" id="form" onSubmit={handleSubmit}>
          <Form.Group controlId="comment-input">
            <Form.Label>Comment</Form.Label>

            <Form.Control
              className="form-control is-invalid"
              name="comment"
              as="textarea"
              required
              rows={3}
              onChange={handleChange}
              value={commentData.comment}
            />
          </Form.Group>
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

export default UpdateCommentPopup;
