import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import Swal from 'sweetalert2';
import Header from '../../components/Header/Header';
import Card from '../../components/UI/Card/Card';
import Button from '../../components/UI/Button/Button';
import { Tiptap } from '../../components/UI/RichTextEditor/TipTap';
import ModalCustom from '../../components/UI/Modal/Modal';
import Loading from '../../components/UI/Loading/Loading';
import { useActivityComments, useBoardTemplate, useProjects } from '../../../../hooks';
import styles from './AddBoard.module.css';
import ResultBoard from '../../components/ResultBoardnew/ResultBoard';
import useActivityCriteriaRelation from '../../../../hooks/useActivityCriteriaRelation';


function AddBoard() {
  const { id, templateid } = useParams();
  const { createProjectBoard } = useProjects();
  const { getTemplate } = useBoardTemplate();
  const [template, setTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState(sessionStorage.getItem('contents'));
  const [activityComments, setActivityComments] = useState([]);

  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const activityID = location.state?.textToPass; // Access the passed text
  const {comments } = useActivityComments(activityID);
  const { getActivityCriteriaByActivityId } = useActivityCriteriaRelation();
  const [criteriaFeedback, setcriteriaFeedback] = useState();
  const [jsoncriteriaFeedback, setjsoncriteriaFeedback] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getActivityCriteriaByActivityId(activityID); // Await the data fetching
        setcriteriaFeedback(data); // Set the fetched data to state

        if (data && Array.isArray(data)) {
          console.log('true'); // Use console.log instead of print
  
          const transformedData = data.reduce((acc, curr) => {
            const criteriaName = curr.activity_criteria_name.name; // Access the name from the nested object
  
            acc[criteriaName] = {
              score: curr.rating,
              description: curr.activity_criteria_feedback
            };
            return acc;
          }, {});
  
          const jsonString = JSON.stringify(transformedData, null, 2);
          setjsoncriteriaFeedback(jsonString); // Store the transformed JSON
        }
      } catch (error) {
        console.error("Error fetching activity criteria data:", error);
      }
    };

    fetchData(); // Call the async function defined above
  }, [activityID]);

  useEffect(() => {
    if (comments) {
      setActivityComments(comments);
    }
  }, [comments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTemplate(templateid);
        setTemplate(response.data);
        if (!newContent) {
          setNewContent(response.data.content || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [templateid]);

  useEffect(() => {
    sessionStorage.setItem('contents', newContent);
  }, [newContent]);

  const addProjectBoard = async () => {
    setIsModalOpen(true);
    try {
      const response = await createProjectBoard(id, {
        body: {
          title: template.title,
          template_id: templateid,
          feedback: 's',
          recommendation: 's',
          references: 's',
          project_id: id,
          criteria_feedback: jsoncriteriaFeedback,
          activity_id: activityID
        },
      });
      navigate(`/project/${id}/create-board/${response.data.id}/result`);
    } catch (error) {
      console.error('Error creating ProjectBoard:', error);
      Swal.fire({
        title: 'Error. Please try again',
        icon: 'error',
        confirmButtonColor: '#9c7b16',
      });
    }
    setIsModalOpen(false);
    sessionStorage.removeItem('contents');
  };

  const goBack = () => {
    console.log('classId: ' +location.state?.classId);
    navigate(`/project/${id}/create-board/${templateid}/rules`, {
      state: { classId: location.state?.classId }, // Pass back the rules state
    });
  };

  const commentString = (() => {
    if (activityComments.length > 0 && typeof activityComments[0].comment === 'string') {
      return activityComments[0].comment;
    }
    return 'No feedback available';
  })();
  // if (!template) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className={styles.body}>
      <Header />
      <div className="d-flex">
        <span className={styles.back} onClick={goBack}>
          <IoArrowBackSharp />
        </span>
        <div className={styles.container}>
          {template ? (
            <span>
              <span className={styles.title}>{template.title}</span>
              
              {/* <Card className={styles.cardContainer}>
                <div className={styles.box} />
                <div className={styles.containerStyle}>
                  <Tiptap setDescription={setNewContent} value={newContent} />
                </div>
              </Card> */}
            </span>
          ) : (
            <Loading />
          )}
        <div className={styles.tabContent}>
        <button
  onClick={async () => {
    try {
      console.log("Result:", activityID); // Print the resolved value
    } catch (error) {
      console.error("Error fetching activity criteria relation:", error); // Handle any errors
    }
  }}
>
  Print Boards
</button>
              <>
                <div className={styles.tabHeader}>
                  {/* <p>Result</p> */}
                </div>
                <div style={{ minHeight: '10rem' }}>
                  <ResultBoard feedback={jsoncriteriaFeedback} />
                </div>
              </>
          </div>
                <Card style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px auto', // Center horizontally with auto margins
                padding: '20px',
                maxWidth: '80%' // Optional: Adjust the maximum width
              }}>
              <h4>Teacher's Feedback</h4>
              <p>
                {(() => {
                  const commentString = activityComments[activityComments.length - 1]?.comment;
                    
                  // Check if the commentString is valid and a string
                  if (typeof commentString === 'string') {
                    return '';
                  }
                  return 'The teacher did not give a feed back yet.';
                })()}

                {/* Display all comments in passedText */}
                {activityComments.map((item, index) => (
                  <span key={index}>{item.comment}<br /></span>
                ))}
              </p>

            </Card>

          {isModalOpen && (
            <ModalCustom width={200} isOpen={isModalOpen}>
              <Loading timeout="auto" style={{ height: 'auto' }} />
            </ModalCustom>
          )}
          {jsoncriteriaFeedback && (
          <Button className={styles.button} onClick={addProjectBoard}>
            Submit
          </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddBoard;
