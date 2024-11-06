import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import ProjectContents from '../components/ProjectDetails/ProjectContent';
import { useProjects } from '../../../hooks';
import styles from './TeamProject.module.css';

function TeamProject() {
  const { teamid } = useParams();
  const { user, classId } = useOutletContext();

  const { teamProjects } = useProjects();
  const isClass = user.role === 1;

  const [teamName, setTeamName] = useState('');
  const [selected, setSelected] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await teamProjects(teamid);
        setTeamName(response.data.team_name);
        if (response.data.projects.length > 0) {
          const activeProject = response.data.projects.find((project) => project.is_active);

          if (activeProject) {
            setSelected(activeProject.id);
          } else {
            setSelected(response.data.projects[0].id);
          }
        } else {
          setSelected(-1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const goBack = () => {
    navigate(`/classes/${classId}/allteamprojects`);
  };

  if (selected === -1) {
    return (
      <div className="px-5 d-flex justify-content-start">
        <div className="d-flex justify-content-start">
          <span style={{ cursor: 'pointer' }} onClick={goBack}>
            <IoArrowBackSharp />
          </span>
          <p className={styles.text}>{teamName}</p>
        </div>
        <div className={styles.noCreated}>
          <p>No projects created by this team. </p>
        </div>
      </div>
    );
  }

  if (!selected) {
    return <p>Loading...</p>;
  }

  return (
    <div className="px-5 d-flex justify-content-start">
      <span style={{ cursor: 'pointer' }} onClick={goBack}>
        <IoArrowBackSharp />
      </span>
      <div>
        <p className={styles.text}>{teamName}</p>
        <ProjectContents selected={selected} setSelected={setSelected} isClass={isClass} />
      </div>
    </div>
  );
}

export default TeamProject;
