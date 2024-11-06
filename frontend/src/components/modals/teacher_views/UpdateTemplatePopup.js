import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { useActivityTemplates, useActivityTemplate } from '../../../hooks';

const UpdateTemplatePopup = ({ show, handleClose, data }) => {
  const { templateId } = useParams();
  const { courses } = useActivityTemplates();
  const { updateTemplate } = useActivityTemplate(templateId);

  const navigate = useNavigate();

  const [courseOptions, setCourseOptions] = useState([]);
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    course_name: '',
  });

  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption);

    setTemplateData((prevState) => ({
      ...prevState,
      course_name: selectedOption.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData({
      ...templateData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateTemplate(templateData);
      await handleClose();
      navigate(0);
    } catch (error) {
      console.error('Error creating template:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  useEffect(() => {
    if (courses) {
      const options = courses.map((course) => ({
        value: course.course_name,
        label: course.course_name,
      }));
      setCourseOptions(options);
    }
  }, [courses]);

  useEffect(() => {
    if (data) {
      setSelectedCourse({ value: data.course_name, label: data.course_name });
      setTemplateData({ ...data });
    }
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">Create Template</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column gap-3 was-validated" id="form" onSubmit={handleSubmit}>
          <Form.Group controlId="title-input">
            <Form.Label>Title</Form.Label>
            <Form.Control
              className="form-control is-invalid"
              as="input"
              type="text"
              name="title"
              required
              value={templateData.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="description-input">
            <Form.Label>Description</Form.Label>
            <Form.Control
              className="form-control is-invalid"
              as="textarea"
              name="description"
              required
              value={templateData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="course-id-input">
            <Form.Label>Course</Form.Label>
            <CreatableSelect
              className="form-control"
              onChange={handleCourseChange}
              options={courseOptions}
              value={selectedCourse}
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

export default UpdateTemplatePopup;
