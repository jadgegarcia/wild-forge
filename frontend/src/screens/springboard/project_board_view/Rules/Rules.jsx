import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import { IoArrowBackSharp } from 'react-icons/io5';
import Loading from '../../components/UI/Loading/Loading';
import Header from '../../components/Header/Header';
import Card from '../../components/UI/Card/Card';
import Button from '../../components/UI/Button/Button';
import { useActivities, useActivityComments, useBoardTemplate, useProjects } from '../../../../hooks';
import styles from './Rules.module.css';

function Rules() {
  const navigate = useNavigate();
  const { id, templateid } = useParams();
  const { getTemplate } = useBoardTemplate();
  const [template, setTemplate] = useState(null);

  const location = useLocation();
  const { classId } = location.state || {}; // Extract classId from the state
  const {activities: activitiesFromHook } = useActivities(classId);
  const [teamId, setTeamId] = useState(null);
  const [groupActsByTeam, setGroupActsByTeam] = useState({});

  useEffect(() => {
    if (activitiesFromHook) {
      const groupedActivities = activitiesFromHook.reduce((groups, activity) => {
        activity.team_id.forEach((teamId) => {
          if (!groups[teamId]) {
            groups[teamId] = [];
          }
          groups[teamId].push(activity);
        });
        return groups;
      }, {});
      setGroupActsByTeam(groupedActivities);
      console.log('Group Activity:', groupedActivities);
      console.log('TEAM ID:', teamId);
  console.log('Group Activity:', groupedActivities);
    }
  }, [activitiesFromHook]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTemplate(templateid);
        setTemplate(response.data || '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [templateid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getProject } = useProjects(); // Moved useProjects() out of the try block
        const response = await getProject(id); // Await the async function call
        const project = response.data?.project || ''; // Use optional chaining to avoid errors if data is undefined
        console.log(project);
        setTeamId(project.team_id);
        console.log(teamId);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); // Call the async function
  }, []);

  const onClickView = () => {
    navigate(`/project/${id}/create-board/${templateid}/template`);
  };

  const goBack = () => {
    sessionStorage.removeItem('contents');
    const storedPath = sessionStorage.getItem('goToClass');
    navigate(storedPath);
  };

  const handleClick = async (activityId) => {
    navigate(`/project/${id}/create-board/${templateid}/template`, {
      state: { textToPass: activityId+"" ,
        classId: classId
      } // Pass the activityId as state
    });
  };

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
        <Card className={styles.card}>
          {template ? (
            <div className={styles.container}>
              <h3 className={styles.textColor}>
                Before we proceed, please take note of the following guidelines for a successful
                evaluation of your idea.
              </h3>
              <h3>Teacher's rules:</h3>
              <div> {parse(template.rules)} </div>

              <span className={styles.content}>
                We will now assess your idea based on the data you inputted. It's important that you
                provide accurate and honest information to ensure a proper evaluation of your idea.
                We will evaluate your idea based on the following criteria:
                <br />
                <br />
                <b>Capability:</b> The potential of your idea to address the problem or need you
                identified
                <br />
                <b>Novelty:</b> The level of originality or uniqueness of your idea
                <br />
                <b>Technical Feasibility:</b> The feasibility of your idea from a technical
                perspective, including its scalability, sustainability, and viability Please input
                your data carefully, as this will determine the outcome of your assessment.
              </span>
            </div>
          ) : (
            <Loading />
          )}
        </Card>
      </div>
      <Card className={styles.container_card} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px auto', // Center horizontally with auto margins
                padding: '20px',
              }}>
        <p>Select an activity from the following list.</p>
        
        {/* <button
        onClick={() => {
          console.log(teamId + "")
          const groupedActivities = activitiesFromHook.reduce((groups, activity) => {
            activity.team_id.forEach((teamId) => {
              if (!groups[teamId]) {
                groups[teamId] = [];
              }
              groups[teamId].push(activity);
            });
            return groups;
          }, {});
          setGroupActsByTeam(groupedActivities);
          console.log('Group Activity:', groupedActivities);
          console.log('TEAM ID:', teamId);
          console.log('class ID:', teamId);

                }}
      >
        Print Boards
      </button> */}

      <div className={styles.scrollable}>
  {Object.entries(groupActsByTeam)
    .filter(([id]) => id === teamId+"") // Filter based on the teamId state
    .map(([teamId, teamActivities]) => (
      <div key={teamId}>
        {teamActivities.map((activity) => (
          <Card
            style={{
              margin: '20px auto',
            }}
            key={activity.id}
            className={styles.container_board}
            onClick={() => handleClick(activity.id)} // Update state on click
          >
            <div className={styles.words}>
              <h4>{activity.title}</h4>
              <p>
                {activity.description.length > 150
                  ? `${activity.description
                      .substr(0, 150)
                      .split(' ')
                      .slice(0, -1)
                      .join(' ')}...`
                  : activity.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    ))}
</div>

      </Card>
      {/* <Button className={styles.button} onClick={onClickView}>
        Start
      </Button> */}
    </div>
  );
}

export default Rules;
