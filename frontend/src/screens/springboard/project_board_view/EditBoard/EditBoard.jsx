import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import Swal from 'sweetalert2';

import Header from '../../components/Header/Header';
import Card from '../../components/UI/Card/Card';
import Button from '../../components/UI/Button/Button';
import { Tiptap } from '../../components/UI/RichTextEditor/TipTap';
import ModalCustom from '../../components/UI/Modal/Modal';
import Loading from '../../components/UI/Loading/Loading';
import ResultBoard from '../../components/ResultBoardnew/ResultBoard';

import { useActivityComments, useProjects } from '../../../../hooks';

import styles from './EditBoard.module.css';
import useActivityCriteriaRelation from '../../../../hooks/useActivityCriteriaRelation';

function EditBoard() {
  const { getProjectBoardById, updateProjectBoard } = useProjects();

  const [title, setTitle] = useState(null);
  const [criteria_feedback, setcriteria_feedback] = useState();
  const [content, setContent] = useState(sessionStorage.getItem('contents'));
  const [score, setScore] = useState(0);
  const [boardId, setBoardId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id, boardid } = useParams();
  const { getActivityCriteriaByActivityId } = useActivityCriteriaRelation();
  const [activityID, setacttivityID] = useState();
  const [jsoncriteriaFeedback, setjsoncriteriaFeedback] = useState();


  const location = useLocation();

  // Fetch board details and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectBoardById(boardid);
        console.log(response);
        setTitle(response.data.title || '');
        if (!content) {
          setContent(response.data.criteria_feedback || '');
        }
        
        setBoardId(response.data.board_id || '');
        setProjectId(response.data.project_fk || '');
        setScore(response.data.score || '')
        setacttivityID(response.data.activity_id || '')
        setcriteria_feedback(response.data.criteria_feedback)
        console.log('data: '+JSON.stringify(response.data, null, 2))
        const data = await getActivityCriteriaByActivityId(response.data.activity_id); // Await the data fetching
        console.log(data)
        if (data && Array.isArray(data)) {
          console.log('true'); // Use console.log instead of  print
  
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
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [boardid, content]);



  useEffect(() => {
    sessionStorage.setItem('contents', content);
  }, [content]);

  const updateBoard = async () => {
    setIsModalOpen(true);
    console.log(activityID);
    try {
      const response = await updateProjectBoard(boardid, {
        body: {
          title,
          activity_id: activityID,
          feedback: 'error',
          recommendation: 'error',
          project_id: projectId,
          board_id: boardId,
          score,
          criteria_feedback: jsoncriteriaFeedback,
        },
      });
      setIsModalOpen(false);
      navigate(`/project/${id}/board/${response.data.id}/edit/result`);
    } catch (error) {
      setIsModalOpen(false);
      Swal.fire({
        title: 'Error. Please try again',
        icon: 'error',
        confirmButtonColor: '#9c7b16',
      });
      console.error('Error updating ProjectBoard:', error);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('contents');
    navigate(`/project/${id}/board/${boardid}`);
  };

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.container}>
        <span className={styles.title}>
          <span className={styles.back} onClick={handleBack}>
            <IoArrowBackSharp />
          </span>
          {title}
        </span>
        <button
          onClick={() => {
            console.log('projectboard:', activityID);
          }}
          className={styles.printButton}
        >
          Print 
        </button>
        <Card className={styles.cardContainer}>
          <div className={styles.box} />
          {content ? (
            <div className={styles.containerStyle}>
              {/* <Tiptap setDescription={setContent} value={content} /> */}
              <div style={{ minHeight: '10rem' }}>
                {/* Only render ResultBoard if comments are available */}
                {criteria_feedback ? (
                  <ResultBoard feedback={jsoncriteriaFeedback} />
                ) : (
                  <p>No comments available</p>
                )}
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </Card>
        {isModalOpen && (
          <ModalCustom width={200} isOpen={isModalOpen}>
            <Loading timeout="auto" style={{ height: 'auto' }} />
          </ModalCustom>
        )}
        <Button className={styles.button} onClick={updateBoard}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default EditBoard;
