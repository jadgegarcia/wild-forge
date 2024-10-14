import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useWorks } from '../../../hooks';

export const EditWorkPopup = ({ show, handleClose, editWorkData, onSubmit, id, workId }) => {
  const fetchData = useWorks(id);

  const [workData, setWorkData] = useState({
    description: '',
    file_attachment: null,
    activity_id: id,
  });

  const [editData, setEditData] = useState(editWorkData || {});
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    setEditData(editWorkData || {});
  }, [editWorkData]);

  const fileAttachmentName =
    editData?.file_attachment && editData?.file_attachment?.split('/').pop();

  // Delete Work

  const handleDelete = async (e) => {
    const response = await fetchData.deleteWork(editData.id);

    window.location.reload();
  };

  // Get work
  useEffect(() => {
    // Update workData with the values from editData when modal is opened
    setWorkData({
      description: editData?.description || '',
      file_attachment: editData?.file_attachment || null,
      activity_id: id,
    });
  }, [editData, id]);

  // Update Work

  const [fileAttachmentError, setFileAttachmentError] = useState(false);
  const [workError, setWorkError] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  const handleUpdate = async (e) => {
    setSubmitButtonClicked(true);

    if (workData.description.trim() === '') {
      setWorkError(true);
      return;
    }

    const formData = new FormData();
    formData.append('activity_id', id);
    formData.append('description', workData.description);

    const response = await fetchData.updateWork(
      workId, // Pass the id for completing the URL
      formData // Pass the formData for the request body
    );

    if (response) {
      setIsDataChanged(false); // Reset the flag
      handleClose();
    }

    window.location.reload();
  };

  const handleRemoveFile = () => {
    setWorkData((prevData) => ({
      ...prevData,
      file_attachment: null,
    }));
    setIsDataChanged(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setWorkData((prevData) => ({
      ...prevData,
      [name]: name === 'file_attachment' ? files[0] : value,
    }));

    if (name === 'description' && value !== editData?.description) {
      setIsDataChanged(true);
    }
    if (name === 'file_attachment' && files[0] !== editData?.file_attachment) {
      setIsDataChanged(true);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">Edit Work</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column gap-3" encType="multipart/form-data">
          <Form.Group controlId="work-input">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={workData?.description}
              onChange={handleChange}
            />
          </Form.Group>
          {workError && workData.description.trim() === '' && (
            <p className="text-danger">Please add text to the Description field.</p>
          )}

          {/* Add more Form.Group elements for other fields as needed */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="secondary"
          onClick={handleUpdate}
          disabled={!isDataChanged} // Disable the button if no changes
        >
          Update Work
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete Work
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default EditWorkPopup;
