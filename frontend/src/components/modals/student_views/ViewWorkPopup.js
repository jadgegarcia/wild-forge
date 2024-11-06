import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useWorks } from '../../../hooks';
// import { useCreateWorkMutation } from "../../../Api/Work";

const ViewWorkPopup = ({ show, handleClose, id }) => {
  const navigate = useNavigate();
  const [workData, setWorkData] = useState({
    description: '',
    file_attachment: null,
    activity_id: id,
  });

  const [disable, setDisable] = useState(false);
  const [prompt, setPrompt] = useState({ show: false, message: '' });

  // const createWork = useCreateWork();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setWorkData((prevData) => ({
      ...prevData,
      [name]: name === 'file_attachment' ? files[0] : value,
    }));
  };

  const handleModalHide = () => {
    setPrompt({ show: false, message: '' });
    setDisable(false);
    handleClose();
  };

  const fetchData = useWorks(id);

  const handleUpdate = async (e) => {
    if (!workData.description) {
      setPrompt({
        show: true,
        message: "Please provide a 'Description' before submitting.",
      });
      return;
    }

    const formData = new FormData();
    formData.append('activity_id', id);
    formData.append('description', workData.description);
    // Check if there is a file attached
    if (workData.file_attachment !== null) {
      formData.append('file_attachment', workData.file_attachment);
    }

    const response = await fetchData.addWork(formData);
    setWorkData({ description: '', file_attachment: null });
    setDisable(false);

    window.location.reload();
  };

  return (
    <Modal centered show={show} onHide={handleModalHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">Add Work</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="desciption-input">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={workData.description}
              onChange={handleChange}
              disabled={disable}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="file-input">
            <Form.Label>File Attachment</Form.Label>
            <Form.Control
              type="file"
              name="file_attachment"
              onChange={handleChange}
              disabled={disable}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {prompt.show && <p className="text-danger">{prompt.message}</p>}
        <button className="btn btn-secondary bw-3 btn-block fw-bold" onClick={handleUpdate}>
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewWorkPopup;
