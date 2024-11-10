import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import styles from './Board.module.css';
import Card from '../UI/Card/Card';
import IdeaIcon from '../images/idea.png';
// import Button from '../UI/Button/Button';
import CircularProgressWithLabel from '../UI/ProgressBar/CircularProgressWithLabel';
import Loading from '../../../../components/loading';
import { useAuth } from '../../../../contexts/AuthContext';
import { useClassMemberTeam, useProjects } from '../../../../hooks';

function Board({ isClass, selected, project, setBoardTemplateIds }) {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  // temporary container
  let officialTeam = null;
  let teamId = 0;

  // checking if this component is intended for class or not
  // this is due to the nature of the data. useOutletContext is from Classroom layout
  // but this component can be used outside the classroom layout so we have to check
  if (!isClass) {
    const { classId, classMember } = useOutletContext();
    const { team } = useClassMemberTeam(classId, classMember?.id);

    // team can be null for the meantime due to it being async
    if (team) {
      officialTeam = team;
      teamId = officialTeam ? officialTeam.id : 0;
    }
  }

  const { getProjectBoardByProjId } = useProjects();

  const navigate = useNavigate();
  const [loadCount, setLoadCount] = useState(0);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadCount((prevLoadCount) => prevLoadCount + 1);

        const boardsResponse = await getProjectBoardByProjId(selected);
        const boardsTemp = boardsResponse.data;
        // Set the templateIds
        // this checks what templates are already accomplished and pass it to BoardCreation
        if (setBoardTemplateIds) {
          const templateIds = new Set(boardsTemp.map((board) => board.template_id));
          setBoardTemplateIds(templateIds);
        }
        const sortedBoards = [...boardsTemp].sort((a, b) => a.template_id - b.template_id);
        setBoards(sortedBoards);
      } catch (error) {
        console.error(`Error fetching data: ${error}`, error);
      }
    };
    fetchData();
  }, [selected]);

  const onClickView = (id) => {
    navigate(`/project/${project.id}/board/${id}`);
  };

  // if (!team && !isClass) {
  //   return <p>Loading..</p>;
  // }

  return (
    <div className={styles.board}>
      {loadCount === 0 && <Loading />}
      {/* <button
        onClick={() => {
          console.log('Board Details:', boards);
        }}
        className={styles.printButton}
      >
        Print Boardssas
      </button> */}

      <div className={styles.scrollable}>
        {project && boards.length === 0 && user.role === 2 && teamId === project.team_id && (
          <p className={styles.centeredText} style={{ width: '45rem' }}>
            It looks like the team haven't created any boards yet. <br /> Click on the "Create
            Board" button to get started and create your team's first board.
          </p>
        )}
        {project && boards.length === 0 && (user.role !== 2 || teamId !== project.team_id) && (
          <p className={styles.centeredText} style={{ width: '45rem' }}>
            It looks like the team haven't created any boards yet. <br />
          </p>
        )}
        {boards.map((board) => (
          <div key={board.id}>
            <Card className={styles.card} onClick={() => onClickView(board.id)}>
              <div className={styles.container}>
                <div className={styles.subcontainer}>
                  <img className={styles.ideaicon} src={IdeaIcon} alt="IdeaIcon" />
                </div>

                <div className={styles.content}>
                  <h3>Board: {board.title}</h3>
                  <div>
                    <div className={styles.cards}>
                                  {/* Assuming board.activity_comments contains a valid JSON string */}
              {board.criteria_feedback && (() => {
                const comments = JSON.parse(board.criteria_feedback); // Parse the JSON string

                return Object.keys(comments).map((key, index) => {
                  const comment = comments[key]; // Access each comment's score and description

                  return (
                    <Card className={styles.smallCard} key={index}>
                      <h5 className={styles.ratings}>{key}</h5> {/* Displaying the comment category title */}
                      <div className={styles.cardContent}>
                        <CircularProgressWithLabel value={comment.score * 10} /> {/* Circular progress for the score */}
                      </div>
                    </Card>
                  );
                });
              })()}

                    </div>
                    {/* <button className={styles.viewbutton} onClick={() => onClickView(board.id)}>
                      View Board
                    </button> */}
                  </div>
                </div>
              </div>
            </Card>

      {/* <button
        onClick={() => {
          const comment = JSON.parse(board.activity_comment.comment)
          console.log('Board Details:', comment);
        }}
        className={styles.printButton}
      >
        Print Boardssas
      </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
