import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiTrash, FiEdit2 } from 'react-icons/fi';
import { useActivities, useActivity, useActivityComments, useProjects, useWorks } from '../../../../../hooks';
import {
  CreateEvaluationPopup,
  CreateCommentPopup,
  UpdateActivityPopup,
  UpdateCommentPopup,
} from '../../../../../components/modals/teacher_views';
import { WorkCard } from '../../../../../components/cards/work_cards';
import useActivityCriteria from '../../../../../hooks/useActivityCriteria';
import { ShowFeedbackPopup } from '../../../../../components/modals/teacher_views';
import useActivityCriteriaRelation from '../../../../../hooks/useActivityCriteriaRelation';
import DeleteIcon from '../../../../../icons/trash.svg';
import EditIcon from '../../../../../icons/pen.svg';
import FinalizeIcon from '../../../../../icons/check-lg.svg';
import './style.scss';



const ViewActivityTeacher = () => {
  const { classId } = useOutletContext();
  const { activityId, teamId } = useParams();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const [showAddEvaluationModal, setShowAddEvaluationModal] = useState(false);
  const handleCloseAddEvaluationModal = () => setShowAddEvaluationModal(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const handleCloseCommentModal = () => setShowCommentModal(false);
  const [showUpdateCommentModal, setShowUpdateCommentModal] = useState(false);
  const handleCloseUpdateCommentModal = () => setShowUpdateCommentModal(false);

  const { isRetrieving, activity, deleteTeamActivity } = useActivity(classId, teamId, activityId);
  const { deleteEvaluation } = useActivities(classId);
  const { comments, deleteComment } = useActivityComments(activityId);
  const [comment, setComment] = useState(null);
  const [activityComments, setActivityComments] = useState([]);

  const { isRRetrieving, ractivity, updateActivity } = useActivity(classId, teamId, activityId);
  const [returnStatus, setReturnStatus] = useState(false);
  const { createProjectBoard } = useProjects();


  // -------------------- START CRITERIA ------------------------------
  const [activityCriteriaOptions, setActivityCriteriaOptions] = useState([]);
  const { activityCriterias, getActivityCriteriaById } = useActivityCriteria(activityId);
  const [activityCriteriaNames, setActivityCriteriaNames] = useState([]);
// -------------------- END CRITERIA ------------------------------

  const { isLoading, activityCriteriaRelations, updateActivityCriteriaRelation } = useActivityCriteriaRelation(classId, teamId, activityId);

  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [selectedCriteriaName, setSelectedCriteriaName] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState({});


  const [filteredCriteriaRelations, setFilteredCriteriaRelations] = useState([]);
  const [criteriaNames, setCriteriaNames] = useState([]);
  console.log("THIS IS THE ACTIVITY: " + activity);
  useEffect(() => {
    // Filter criteria relations by activityId
    const filteredRelations = activityCriteriaRelations.filter(
      (relation) => relation.activity === parseInt(activityId, 10)
    );
  
    setFilteredCriteriaRelations(filteredRelations);
  
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
            rating: relation.rating,
            activity_id: relation.activity,
            criteria_id: relation.activity_criteria,
            name: criteria.data.name
          };
        })
      );
      setCriteriaNames(names);
      //console.log("Criteria Names:", JSON.stringify(names, null, 2));
    };
  
    if (filteredRelations.length > 0) {
      fetchCriteriaNames();
    }
  }, [activityCriteriaRelations, activityId]);

  const handleShowModal = (criteria, relationId) => {
    //console.log("Criteria in ShowModal:", criteria); // Log the criteria object

    const modalData = {
      id: relationId,
      strictness: criteria.strictness,
      criteria_status: criteria.criteria_status,
      criteria_feedback: criteria.criteria_feedback,
      activity_id: criteria.activity_id,
      criteria_id: criteria.criteria_id,
      name: criteria.name,
      rating: criteria.rating
    };
    
    setSelectedFeedback(modalData);
    setShowCriteriaModal(true);
};
  

  const handleCloseModal = () => {
    setShowCriteriaModal(false);
    setSelectedCriteriaName(''); // Reset the selected criteria name
  };

  useEffect(() => {
    if (activity) {
      const temp = { ...activity };
      const activityCriterias = { ...activity.activityCriteria_id };
      setActivityData(temp);
      setActivityCriteriaOptions(activityCriterias);
    }
  }, [activity]);

  useEffect(() => {
    // Extract keys from activityCriteriaOptions
    const keys = Object.keys(activityCriteriaOptions);


      
    // Fetch activity criteria for each key
    Promise.all(keys.map(key => getActivityCriteriaById(activityCriteriaOptions[key])))
      .then(responses => {
         // Log the array of responses
        // Iterate over each response to access individual response data
        responses.forEach(response => {
          setActivityCriteriaNames(prevNames => [...prevNames, response.data.name]);
           // Log the data property of each response
          // Further access specific properties as needed
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, [activityCriteriaOptions]);
  
  useEffect(() => {
    if (activityData && comments) {
      setActivityComments(comments);
    }
  }, [activityData, comments]);

  const handleDeleteEvaluation = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this evaluation?');

    if (isConfirmed) {
      try {
        const response = deleteEvaluation(teamId, activityId);
        navigate(0);
      } catch (error) {
        console.error(error);
      }
    } else {
      // The user canceled the deletion
      // console.log("Deletion canceled");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this activity?');

    if (isConfirmed) {
      try {
        await deleteTeamActivity();
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    } else {
      // The user canceled the deletion
    }
  };

  useEffect(() => {
    if (activity) {
      // Assuming 'return_status' is a property of the activity object
      setReturnStatus(activity.return_status);
    }
  }, [activity]);

  const handlePrint = () => {
    console.log(activity);
  };
  const addProjectBoard = async () => {
    try {
      const response = await createProjectBoard(activity.spring_project.id, {
        body: {
          title: activity.title,
          // template_id: templateid,
          feedback: 's',
          recommendation: 's',
          references: 's',
          project_id: activity.spring_project.id,
          // criteria_feedback: jsoncriteriaFeedback,
          activity_id: activity.id,
          classroom: classId
        },
      });
    } catch (error) {
      console.error('Error creating ProjectBoard:', error);
    }
  };

  const handleReturnActivity = async () => {

    // Check if the activity has already been evaluated
    if (activityData.evaluation === null || activityData.evaluation === 0) {
      alert('Activity must be evaluated before returning it.');
      return; // Exit the function if not evaluated
    }



    // Show alert before performing the operation
    const confirmReturn = window.confirm('Are you sure you want to return this activity? Once returned you cannot undo.');

    if (!confirmReturn) {
      // If user clicks 'Cancel', exit the function
      return;
    }
    
    try {
      const { spring_project, ...activityWithoutSpringProject } = activity;
      const updatedData = {
        ...activityWithoutSpringProject,
        return_status: true, // Set return_status to true
      };

      const resp = await updateActivity(updatedData);
      console.log("THIS IS RESPONSE: " + resp);
      setReturnStatus(true);
      console.log('Activity successfully returned.');
    } catch (error) {
      console.error('Error returning the activity:', error);
    }
    addProjectBoard();
  };
  

  const handleEdit = (e) => {
    e.preventDefault();
    setShowUpdateModal(true);
  };

  const handleCommentDelete = async (e, commentId) => {
    e.preventDefault();
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this comment?');

    if (isConfirmed) {
      try {
        await deleteComment(commentId);
        navigate(0);
      } catch (error) {
        console.error(error);
      }
    } else {
      // The user canceled the deletion
      // console.log("Deletion canceled");
    }
  };

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

  const handleUpdateComment = (e, commentId) => {
    e.preventDefault();
    setShowUpdateCommentModal(true);
    setComment(commentId);
  };

  // Edit/Delete Work

  const [showAddWorkModal, setShowAddWorkModal] = useState(false);

  const handleAddWork = async (e) => {
    setShowAddWorkModal(true);
  };

  const [workData, setWorkData] = useState(null);
  const fetchData = useWorks(activityId);
  // console.log(fetchData);
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

  const [openIndex, setOpenIndex] = useState(null);

  const toggleDescription = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container-md">
      <div className="container-md d-flex flex-column mt-5 pr-3 pl-3">
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
            {!returnStatus && (

              <button type="button" class="fnlbutton" onClick={handleReturnActivity}>
              <span class="button__text">Finalize</span>
              <span class="button__icon"><img src={FinalizeIcon} alt="Finalize Button" className='white-filter'/></span>
              </button>
              // <button
              //   className="btn btn-success btn-block fw-bold bw-3 m-0 "
              //   // style={{backgroundColor:"#838f9b"}} 
              //   onClick={handleReturnActivity}
              // >
              //   Return Activity
              // </button>
            )}
            {/* <button type="button" class="editbutton" onClick={handlePrint}>
              <span class="button__text">Print Activity</span>
              <span class="button__icon"><img src={EditIcon} alt="Edit Button" className='white-filter'/></span>
            </button> */}
            <button type="button" class="editbutton" onClick={handleEdit}>
              <span class="button__text">Edit</span>
              <span class="button__icon"><img src={EditIcon} alt="Edit Button" className='white-filter'/></span>
            </button>
            {/* <button
              className="btn btn-outline-secondary btn-block fw-bold bw-3 m-0 "
              onClick={handleEdit}
            >
              Edit Activity
            </button> */}

            <button type="button" class="delbutton" onClick={handleDelete}>
              <span class="button__text">Delete</span>
              <span class="button__icon"><img src={DeleteIcon} alt="Delete Button" className='white-filter'/></span>
            </button>
            {/* <button className="btn btn-danger btn-block fw-bold bw-3 m-0 " onClick={handleDelete}>
              <img src={DeleteIcon} alt="Delete Button" className='white-filter'/> Delete
            </button> */}
          </div>
        </div>

        <hr className="text-dark" />

        <div>
          {!isRetrieving && activityData ? (
            <div className="d-flex flex-row justify-content-between ">
              <div>
                <h5>
                  Status:&nbsp;
                  {returnStatus == true ? (
                    <>Returned</>
                  ):(
                    <>Pending</>
                  )}
                </h5>
                <h5>Due: {getFormattedDate()}</h5>
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
                <p className='fs-5'>
                  Evaluation: {activityData?.evaluation ?? 0} / {activityData.total_score}
                </p>
              </div>
            </div>
          ) : (
            <p>Loading class details...</p>
          )}
        </div>


        {/* ----------------------- START CRITERIA ----------------------------- */}
<div className="d-flex flex-column gap-3 mt-4">
  <h5 className="fw-bold">Criteria</h5>

  {criteriaNames && criteriaNames.length > 0 ? (
    <div className="row">
      {criteriaNames.map((criteria) => (
        <div className="col-md-4 mb-3" key={criteria.id}> {/* 3-column layout */}
          <div className="d-flex flex-row justify-content-between align-items-center p-1 border border-dark rounded-3 mb-0">
            <div className="b-0 m-0" style={{ width: '100%', height: '100%' }}>
              <div className="d-flex flex-row gap-2" style={{ width: '100%', height: '100%' }}>
                <div className="fw-bold activity-primary" style={{ width: '100%', height: '100%' }}>
                  <button
                    className="btn btn-block fw-bold bw-3 m-0 activity-primary"
                    style={{ width: '100%', height: '100%' }}
                    onClick={() => handleShowModal(criteria, criteria.id)} // Pass the criteria object
                  >
                    {criteria.name}&nbsp;-&nbsp;{criteria.rating} {/* Display the criteria name */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No criterias available</p>
  )}
</div>
<ShowFeedbackPopup
  show={showCriteriaModal}
  handleClose={handleCloseModal}
  data={selectedFeedback} // Make sure this contains the activity criteria data
/>
{/* ----------------------- END CRITERIA ------------------------------- */}

        <div className="d-flex flex-column gap-3 mt-4">
          <h5 className="fw-bold">Works</h5>

          {workData ? (
            workData.map((work) => (
              <WorkCard
                key={work.id}
                workData={work}
                isClickable={false}
                onEditClick={() => handleSelectWork(work)}
                isSelected={selectedWork && selectedWork.id === work.id}
              />
            ))
          ) : (
            <p>No work data available.</p>
          )}
        </div>

        <div className="d-flex flex-row gap-3 mt-3">
          <button
            className="btn btn-success bw-3"
            onClick={() => setShowAddEvaluationModal(true)}
            hidden={!activityData?.submission_status}
          >
            Add Evaluation
          </button>

          {activityData?.submission_status && (
            <button className="btn btn-outline-secondary bw-3" onClick={handleDeleteEvaluation}>
              Delete Evaluation
            </button>
          )}
        </div>

        <hr className="text-dark" />

        <div className="d-flex flex-column gap-3">
          <h5 className="fw-bold">Comment</h5>

          {activityComments && activityComments.length > 0 ? (
            activityComments.map((_comment) => (
              <div
                className="d-flex flex-row justify-content-between align-items-center p-3 border border-dark rounded-3 mb-2"
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
                <div className="d-flex flex-row gap-3 fw-bold">
                  <button
                    className="nav-item nav-link text-danger d-flex align-items-center"
                    onClick={(e) => handleUpdateComment(e, _comment.id)}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="nav-item nav-link text-danger d-flex align-items-center"
                    onClick={(e) => handleCommentDelete(e, _comment.id)}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No comments available</p>
          )}
        </div>
        <button
          className="btn btn-activity-primary  bw-3"
          onClick={() => setShowCommentModal(true)}
        >
          Add Comment
        </button>
      </div>

      {activityData && (
        <UpdateActivityPopup
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          classId={classId}
          teamId={teamId}
          activityId={activityId}
          data={activityData}
        />
      )}
      {activityData && (
        <CreateCommentPopup
          show={showCommentModal}
          handleClose={handleCloseCommentModal}
          data={activityData}
        />
      )}
      {activityData && (
        <UpdateCommentPopup
          show={showUpdateCommentModal}
          handleClose={handleCloseUpdateCommentModal}
          data={activityData}
          commentId={comment}
        />
      )}
      {activityData && (
        <CreateEvaluationPopup
          show={showAddEvaluationModal}
          handleClose={handleCloseAddEvaluationModal}
          classId={classId}
          teamId={teamId}
          activityId={activityId}
          data={activityData}
        />
      )}
    </div>
    
  );
};

export default ViewActivityTeacher;
