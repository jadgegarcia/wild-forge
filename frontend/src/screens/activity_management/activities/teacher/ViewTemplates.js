import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { TemplateCard } from '../../../../components/cards/activity_cards';
import { useActivityTemplates } from '../../../../hooks';
import { CreateTemplatePopup } from '../../../../components/modals/teacher_views';

const ViewTemplates = () => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const { isLoading, templates, courses } = useActivityTemplates();
  const navigate = useNavigate();

  const navigateToTemplate = (id) => {
    navigate(`${id}`);
  };

  const [selectedCourse, setSelectedCourse] = useState({
    value: 'all',
    label: 'all',
  });
  const [courseOptions, setCourseOptions] = useState([]);

  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption);
  };
  useEffect(() => {
    if (courses) {
      const options = courses.map((course) => ({
        value: course.course_name,
        label: course.course_name,
      }));
      options.unshift({ value: 'all', label: 'all' });
      setCourseOptions(options);
    }
  }, [courses]);

  return (
    <div className="container-md">
      <div className="container-md d-flex flex-column gap-3 mt-5 pr-3 pl-3">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center gap-3">
            <span
              className="nav-item nav-link"
              onClick={() => {
                navigate(-1);
              }}
            >
              <FiChevronLeft />
            </span>
            <h4 className="fw-bold m-0">Templates</h4>
          </div>
          <div className="d-flex flex-row gap-3 ">
            <button
              className="btn btn-activity-primary btn-block fw-bold bw-3 m-0"
              onClick={handleShowModal}
            >
              Add Template
            </button>
          </div>
        </div>
        <hr className="text-dark" />
        <div className="d-flex flex-row gap-2 align-items-center">
          <label htmlFor="courseFilter" className="m-0">
            Filter By Course:
          </label>

          <Select
            className="w-100"
            options={courseOptions}
            isSearchable
            isLoading={isLoading}
            onChange={handleCourseChange}
            defaultValue={selectedCourse}
          />
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {Array.isArray(templates) && templates.length > 0 ? (
              templates
                .filter(
                  (templateItem) =>
                    selectedCourse.value === 'all' ||
                    templateItem.course_name === selectedCourse.value
                )
                .map((templateItem) => (
                  <div key={templateItem.id}>
                    <p className="fw-bold mb-2">{templateItem.course_name}</p>
                    <TemplateCard
                      templateData={templateItem}
                      onClick={() => navigateToTemplate(templateItem.id)}
                    />
                  </div>
                ))
            ) : (
              <p>No template available</p>
            )}
          </div>
        )}

        <CreateTemplatePopup show={showModal} handleClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default ViewTemplates;
