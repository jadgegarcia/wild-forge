import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiTrash, FiEdit2 } from 'react-icons/fi';
import { useActivities, useActivity, useActivityComments, useWorks } from '../../../../../hooks';
import {
  CreateEvaluationPopup,
  CreateCommentPopup,
  UpdateActivityPopup,
  UpdateCommentPopup,
  ShowFeedbackPopup,
} from '../../../../../components/modals/teacher_views';
import { ViewWorkPopup, EditWorkPopup } from '../../../../../components/modals/student_views';
import { WorkCard } from '../../../../../components/cards/work_cards';
import useActivityCriteria from '../../../../../hooks/useActivityCriteria';
import useActivityCriteriaRelation from '../../../../../hooks/useActivityCriteriaRelation';

const ViewActivityStudent = () => {
  const { classId } = useOutletContext();
  const { activityId, teamId } = useParams();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState(null);

  const { isRetrieving, activity } = useActivity(classId, teamId, activityId);
  const { comments } = useActivityComments(activityId);
  const [comment, setComment] = useState(null);
  const [activityComments, setActivityComments] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [returnStatus, setReturnStatus] = useState(false);

  
    // -------------------- START CRITERIA ------------------------------
    const [activityCriteriaOptions, setActivityCriteriaOptions] = useState([]);
    const { getActivityCriteriaById } = useActivityCriteria(activityId);
    const [activityCriteriaNames, setActivityCriteriaNames] = useState([]);
  // -------------------- END CRITERIA ------------------------------

  console.log("HEREEEEE:");

  const { isLoading, activityCriteriaRelations, updateActivityCriteriaRelation } = useActivityCriteriaRelation(classId, teamId, activityId);

  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [selectedCriteriaName, setSelectedCriteriaName] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState({});

  const [openCriteria, setOpenCriteria] = useState({}); // State to manage which criteria are open

  const handleToggleCriteria = (criteriaId) => {
    setOpenCriteria(prev => ({
      ...prev,
      [criteriaId]: !prev[criteriaId], // Toggle the specific criteria
    }));
  };

  // working good!
  // console.log("activityCriteriaRelations:", JSON.stringify(activityCriteriaRelations, null, 2));
  // console.log("activityCriterias:", JSON.stringify(activityCriterias, null, 2));

  const [filteredCriteriaRelations, setFilteredCriteriaRelations] = useState([]);
  const [criteriaNames, setCriteriaNames] = useState([]);

  useEffect(() => {
    // Filter criteria relations by activityId
    const filteredRelations = activityCriteriaRelations.filter(
      (relation) => relation.activity === parseInt(activityId, 10)
    );
  
    setFilteredCriteriaRelations(filteredRelations);
    console.log("Filtered Relations:", JSON.stringify(filteredRelations, null, 2)); // Log the filtered relations
  
    // Fetch names for the filtered criteria relations
    const fetchCriteriaNames = async () => {
      const names = await Promise.all(
        filteredRelations.map(async (relation) => {
          const criteria = await getActivityCriteriaById(relation.activity_criteria);
          return {
            id: relation.id,
            strictness: relation.strictness,
            criteria_status: relation.activity_criteria_status,
            criteria_feedback: relation.activity_criteria_feedback,
            rating:relation.rating,
            activity_id: relation.activity,
            criteria_id: relation.activity_criteria,
            name: criteria.data.name
          };
        })
      );
      setCriteriaNames(names);
      console.log("Criteria Names:", JSON.stringify(names, null, 2));
    };
  
    if (filteredRelations.length > 0) {
      fetchCriteriaNames();
    }
  }, [activityCriteriaRelations, activityId]);

  const handleShowModal = (criteria, relationId) => {
    console.log("Criteria in ShowModal:", criteria); // Log the criteria object

    const modalData = {
      id: relationId,
      strictness: criteria.strictness,
      criteria_status: criteria.criteria_status,
      criteria_feedback: criteria.criteria_feedback,
      activity_id: criteria.activity_id,
      criteria_id: criteria.criteria_id,
      name: criteria.name
    };
    
    setSelectedFeedback(modalData);
    setShowCriteriaModal(true);
};
  

  const handleCloseModal = () => {
    setShowCriteriaModal(false);
    setSelectedCriteriaName(''); // Reset the selected criteria name
  };
  

  activityComments.forEach(commentNi => {
    // Extract the value associated with the key 'overall_feedback'
    const overallFeedbackMatch = commentNi.comment.match(/'Overall Feedback': '([^']+)'/);
    
    // Check if the match was found
    if (overallFeedbackMatch && overallFeedbackMatch[1]) {
        console.log(overallFeedbackMatch[1]);
    } else {
        console.log("No overall_feedback found in the comment.");
    }
  });

  useEffect(() => {
    if (activity) {
      const temp = { ...activity };
      const activityCriterias = { ...activity.activityCriteria_id };
      setActivityData(temp);
      setSubmitted(!temp.submission_status);
      setReturnStatus(temp.return_status);
      setActivityCriteriaOptions(activityCriterias);
    }
  }, [activity]);

  useEffect(() => {
    // Extract keys from activityCriteriaOptions
    const keys = Object.keys(activityCriteriaOptions);
      
    // Fetch activity criteria for each key
    Promise.all(keys.map(key => getActivityCriteriaById(activityCriteriaOptions[key])))
      .then(responses => {
        console.log(responses); // Log the array of responses
        // Iterate over each response to access individual response data
        responses.forEach(response => {
          setActivityCriteriaNames(prevNames => [...prevNames, response.data.name]);
          console.log(response.data); // Log the data property of each response
          // Further access specific properties as needed
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, [activityCriteriaOptions]);

  console.log("names: ", activityCriteriaNames);

  useEffect(() => {
    if (activityData && comments) {
      setActivityComments(comments);
    }
  }, [activityData, comments]);

  const getFormattedDate = () => {
    if (activityData?.due_date) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const date = new Date(activityData.due_date);
      return date.toLocaleDateString(undefined, options);
    }
    return 'None';
  };

  //  Submit Activity
  const submitAct = useActivity(classId, teamId, activityId);

  const handleSubmit = async (e) => {
    setSubmitted(true);
    const data = {
      submission_status: submitted,
    };
    submitAct.submitActivity(classId, teamId, activityId, data);
    window.location.reload();
  };

  // Edit/Delete Work

  const [showAddWorkModal, setShowAddWorkModal] = useState(false);

  const handleAddWork = async (e) => {
    setShowAddWorkModal(true);
  };

  const [workData, setWorkData] = useState(null);
  const fetchData = useWorks(activityId);
  const fetchWorkDataPromise = fetchData.getWorksByActivity(); // This returns a Promise

  useEffect(() => {
    // const fetchData = useWorks(activityId);

    fetchWorkDataPromise.then((resolvedData) => {
      setWorkData(resolvedData);
    });

    // If fetchData.getWorksByActivity() returns a function to cleanup, use it in the return statement
    return () => {
      // Cleanup logic (if needed)
    };
  }, []);

  // Edit Work
  const [editWorkData, setEditWorkData] = useState(null);
  const [showEditWorkModal, setShowEditWorkModal] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isEditWorkClickable, setIsEditWorkClickable] = useState(false);

  

  // Select a work
  const handleSelectWork = (work) => {
    setSelectedWork(work);
    setSelectedWorkId(work.id);
  };

  const handleEditWork = (work) => {
    if (work) {
      setEditWorkData(work); // Assuming setEditWorkData is a state updater function
      setSelectedWork(work);
      setSelectedWorkId(work.id); // Set the selected work ID
      setShowEditWorkModal(true);
    }
  };

  // Function to handle submitting the edited work
  const handleEditWorkSubmit = async (editedWorkData) => {
    // Implement the logic to update the work data
    // You may need to use the appropriate hook or API call here
    setShowEditWorkModal(false);
  };

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

            <h4 className="fw-bold m-0">{activityData ? `${activityData.title}` : 'Loading...'}</h4>
          </div>

          <div className="d-flex flex-row gap-3">
            {returnStatus === false  && (
              <button
                className="btn btn-outline-secondary btn-block fw-bold bw-3 m-0"
                onClick={handleSubmit}
              >
                {submitted ? 'Submit Activity' : 'Unsubmit Activity'}
              </button>
            )}
            {/* {returnStatus === false && ((activityData?.evaluation === 0) || (activityData?.evaluation === null)) && (
              <button
                className="btn btn-outline-secondary btn-block fw-bold bw-3 m-0"
                onClick={handleSubmit}
              >
                {submitted ? 'Submit Activity' : 'Unsubmit Activity'}
              </button>
            )} */}
          </div>
        </div>

        <hr className="text-dark" />

        <div>
          {!isRetrieving && activityData ? (
            <div className="d-flex flex-row justify-content-between ">
              <div>
                <p className='fs-5'>
                  <span className='fw-bold'>Due: </span> {getFormattedDate()}
                </p>
                <h5>Description:</h5>
                <div
                  className='fs-5'
                  dangerouslySetInnerHTML={{
                    __html: activityData?.description.replace(/\n/g, '<br>'),
                  }}
                />
                <br/>
                 <h5>Instruction:</h5>
                <div
                  className='fs-5'
                  dangerouslySetInnerHTML={{
                    __html: activityData?.instruction.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
              <div>
                {returnStatus ? ( // Check if returnStatus is true
                  <p className='fs-5'>
                    <span className='fw-bold'>Evaluation: </span> {activityData?.evaluation ?? 0} / {activityData.total_score}
                  </p>
                ) : (
                  <p className='fs-5'>
                    <span className='fw-bold'>Evaluation: </span> Not Evaluated Yet
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading class details...</p>
          )}
        </div>

{/* ----------------------- START CRITERIA ----------------------------- */}
<div className="d-flex flex-column gap-3 mt-4">
  <h5 className="fw-bold">Criterias</h5>

  {criteriaNames && criteriaNames.length > 0 ? (
    <div className="row">
      {criteriaNames.map((criteria) => (
        <div className="col-md-4 mb-3" key={criteria.id}>
          <div className="border border-dark rounded-3 mb-0">
            <button
              className="btn btn-block fw-bold bw-3 m-0 activity-primary d-flex justify-content-between align-items-center"
              style={{ width: '100%' }}
              onClick={() => handleToggleCriteria(criteria.id)}
            >
              <span>{criteria.name}&nbsp;-&nbsp;{criteria.rating}</span>
              <span>
                {openCriteria[criteria.id] ? '-' : '+'} {/* Symbol for collapse/expand */}
              </span>
            </button>
            <div className={`collapse ${openCriteria[criteria.id] ? 'show' : ''} p-2 mt-2 border-top border-secondary text-center`}>
              <p>{criteria.criteria_status === 0 ? 'Pending...' : criteria.criteria_feedback}</p> {/* Conditional feedback */}
            </div>

          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No criterias available</p>
  )}
</div>

{/* ----------------------- END CRITERIA ------------------------------- */}



        <div className="d-flex flex-column gap-3 mt-4">
          <h5 className="fw-bold">Works</h5>

          {workData ? (
            workData.map((work) => (
              <WorkCard
                key={work.id}
                workData={work}
                isClickable={!showEditWorkModal}
                onEditClick={() => handleSelectWork(work)}
                isSelected={selectedWork && selectedWork.id === work.id}
              />
            ))
          ) : (
            <p>No work data available.</p>
          )}
        </div>

        <div className="d-flex flex-row gap-3">
          {((activityData?.evaluation === 0) || (activityData?.evaluation === null)) && (
              <button className="btn btn-outline-secondary bw-3 mt-4" onClick={handleAddWork}>
              Add Work
              </button>
          )}
          
          {selectedWork && (
            <button
              className="btn btn-primary bw-3 mt-4"
              onClick={() => handleEditWork(selectedWork)}
            >
              Edit Work
            </button>
          )}
        </div>
        {workData && (
          <ViewWorkPopup
            show={showAddWorkModal}
            handleClose={() => setShowAddWorkModal(false)}
            workData={workData} // Pass any necessary data
            id={activityId}
            // onSubmit={handleSubmitWork} // Define a function to handle work submission
          />
        )}

        <div className="d-flex flex-row gap-3" />

        <hr className="text-dark" />

        <div className="d-flex flex-column gap-3">
          <h5>Comment</h5>

          {activityComments && activityComments.length > 0 ? (
            activityComments.map((_comment) => (
              <div
                className="d-flex flex-row justify-content-between p-3 border border-dark rounded-3 "
                key={_comment.id}
              >
                <div className="b-0 m-3">
                  <div className="d-flex flex-row gap-2">
                    <div className="fw-bold activity-primary">
                      {_comment.user.first_name} {_comment.user.last_name}:
                    </div>
                  </div>
                  {_comment.comment}
                </div>
              </div>
            ))
          ) : (
            <p>No comments available</p>
          )}
        </div>
      </div>

      {showEditWorkModal && (
        <EditWorkPopup
          show={showEditWorkModal}
          handleClose={() => setShowEditWorkModal(false)}
          editWorkData={selectedWork}
          onSubmit={handleEditWorkSubmit}
          id={activityId}
          workId={selectedWorkId}
        />
      )}
    </div>
  );
};

export default ViewActivityStudent;
