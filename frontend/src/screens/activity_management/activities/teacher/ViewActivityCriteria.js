import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import useActivityCriteria from "../../../../hooks/useActivityCriteria";

import UpdateActivityPopup from "../../../../components/modals/teacher_views";
import UpdateActivityCriteriaPopup from "../../../../components/modals/teacher_views/UpdateActivityCriteriaPopup";


const ViewActivityCriteria = () => {
  const { classId } = useOutletContext();
  const { criteriaId, teamId } = useParams();
  const navigate = useNavigate();
  
  const [criteriaData, setCriteriaData] = useState(null);
  const { getActivityCriteriaById } = useActivityCriteria(classId, criteriaId, teamId);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  
  useEffect(() => {
    const fetchActivityCriteria = async () => {
      const response = await getActivityCriteriaById(criteriaId);
      if (response.success) {
        setCriteriaData(response.data);
      } else {
        // Handle error, e.g., navigate to another page or set error state
        navigate('/classes');
      }
    };

    fetchActivityCriteria();
  }, [criteriaId]);

  const handleEdit = (e) => {
    e.preventDefault();
    setShowUpdateModal(true);
  };

  console.log("criteriaData: ", criteriaData);

  return (
    <div className="container-md">
      <div className="d-flex flex-column gap-3 mt-5 pr-3 pl-3">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center gap-3">
            <span
              className="nav-item nav-link"
              onClick={() => navigate(-1)}
            >
              <FiChevronLeft />
            </span>

            <h4 className="fw-bold m-0">
              {criteriaData ? `${criteriaData.name}` : "Loading..."}
            </h4>
          </div>
          <div className="d-flex flex-row gap-3">
            <button
              className="btn btn-outline-secondary btn-block fw-bold bw-3 m-0 "
              onClick={handleEdit}
            >
              Edit Criteria
            </button>
            </div>
        </div>

        <hr className="text-dark" />

        <div>
          {criteriaData ? (
            <div className="d-flex flex-row justify-content-between">
              <div>
                <p>Description:</p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: criteriaData.description.replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            </div>
          ) : (
            <p>Loading activity criteria...</p>
          )}
        </div>

        <hr className="text-dark" />
      </div>

      {criteriaData && (
        <UpdateActivityCriteriaPopup
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          classId={classId}
          teamId={teamId}
          criteriaId={criteriaId}
          data={criteriaData}
        />
      )}
    </div>
  );
};

export default ViewActivityCriteria;
