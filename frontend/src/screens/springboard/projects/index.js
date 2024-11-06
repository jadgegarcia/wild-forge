import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Loading from '../components/UI/Loading/Loading';
import Card from '../components/UI/Card/Card';
import { useClassMemberTeam, useProjects } from '../../../hooks';
import 'primeicons/primeicons.css';
import styles from './index.module.css';

function SpringBoardProjects() {
  const { classId, classMember } = useOutletContext();
  const { team } = useClassMemberTeam(classId, classMember?.id);
  const { teamProjects, createProjects, deleteProjects } = useProjects();
  const [projects, setProjects] = useState();
  const [refresh, setRefresh] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await teamProjects(team?.id);
      if (result.success) {
        setProjects(result.data.projects);
      } else {
        console.error('Error fetching team projects:', result.error);
      }
    };

    if (team?.id) {
      fetchProjects();
    }
  }, [team?.id, refresh]);

  const showCreateProjectModal = () => {
    Swal.fire({
      html: `
        <span style="font-size: 20px">Create a New Project</span>
        <br>
        <input type="text" id="input1" placeholder="Enter new project name" class="swal2-input" style="height: 35px; width: 86%; font-size: 16px; font-family: 'Calibri', sans-serif; display: flex;"/>
        <br>
        <textarea id="input2" placeholder="Enter project description" class="swal2-textarea" style="margin: 0 auto; width: 86%; height: 100px; resize: none; font-size: 16px; font-family: 'Calibri', sans-serif;" maxlength="200"></textarea>
        <div id="charCount" style="text-align: right; color: #555; font-size: 12px; margin-top: 5px;">0/200 characters</div>
        `,
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#9c7b16',
      cancelButtonText: 'Cancel',
      cancelButtonColor: 'rgb(181, 178, 178)',
      preConfirm: async () => {
        const input1Value = document.getElementById('input1').value;
        const input2Value = document.getElementById('input2').value;
        const wordsArray = input2Value.split(/\s+/);
        try {
          if (!input1Value && !input2Value) {
            Swal.showValidationMessage('Project name and description cannot be empty');
          } else if (!input1Value) {
            Swal.showValidationMessage('Project name cannot be empty');
          } else if (!input2Value) {
            Swal.showValidationMessage('Please enter the project description.');
          } else if (input1Value.length > 50) {
            Swal.showValidationMessage(`Project name should be at most 50 characters`);
          } else if (wordsArray.length < 10 || wordsArray.length > 50) {
            Swal.showValidationMessage(
              `Description should have 10 - 50 words. You have ${wordsArray.length} word/s.`
            );
          } else {
            const response = await createProjects({
              body: {
                name: input1Value,
                description: input2Value,
                team_id: team.id,
                reason: 'Created recently',
                is_active: false,
              },
            });

            if (response) {
              Swal.fire({
                title: 'Project Created',
                icon: 'success',
                confirmButtonColor: '#9c7b16',
              });
              setRefresh(!refresh);
            } else {
              Swal.showValidationMessage(
                `Project with the name '${input1Value}' already exists. Please enter another project name.`
              );
            }
          }
        } catch (error) {
          Swal.showValidationMessage(`Error: Creating project error;`);
        }
      },
    });

    const input2 = document.getElementById('input2');
    const charCount = document.getElementById('charCount');

    input2.addEventListener('input', () => {
      const currentLength = input2.value.length;
      charCount.innerText = `${currentLength}/200 characters`;

      if (currentLength > 200) {
        input2.value = input2.value.slice(0, 200);
      }
    });
  };

  const handleCreateProject = () => {
    if (projects.length >= 3) {
      Swal.fire({
        icon: 'error',
        title: 'Project Limit Reached',
        html: 'You have reached the project limit.<br>Only 3 projects per group are allowed.',
        confirmButtonColor: '#8A252C',
      });
    } else {
      showCreateProjectModal();
    }
  };

  const showDeleteProjectModal = (projId) => {
    Swal.fire({
      icon: 'warning',
      title: '<span style="font-size: 20px">Are you sure you want to delete?</span>',
      html: '<span style="font-size: 15px">This will delete this project permanently. You cannot undo this action.</span>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#8A252C',
      cancelButtonText: 'Cancel',
      cancelButtonColor: 'rgb(181, 178, 178)',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProjects(projId);
          Swal.fire({
            title: '<span style="font-size: 20px">Project Sucessfully Deleted</span>',
            icon: 'success',
            confirmButtonColor: '#9c7b16',
            confirmButtonText: 'OK',
          });
          setRefresh(!refresh);
        } catch {
          Swal.fire({
            title: '<span style="font-size: 20px">Error Project Delete</span>',
            icon: 'error',
            confirmButtonColor: '#9c7b16',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const onNavigate = (projId) => {
    navigate(`/classes/${classId}/project/${projId}`);
  };

  if (!team) {
    return (
      <div className="px-5">
        <div className={styles.topBar}>
          <h1>Team Projects</h1>
        </div>
        <div className={styles.noCreated}>
          <p>It looks like you haven't joined/accepted in a team.</p>
          <p>Please join a team first.</p>
        </div>
      </div>
    );
  }

  if (!projects) {
    return <Loading />;
  }

  return (
    <div className="px-5">
      <div className={styles.topBar}>
        <h1>Team Projects</h1>

        <div className={`${styles.cardContainer} mt-3`} onClick={handleCreateProject}>
          <Card className={styles.cardBut}>
            <FontAwesomeIcon className={styles.iconFont} icon={faPlus} />
            <h6 className={styles.createBut}>Create Project</h6>
          </Card>
        </div>
      </div>

      <div className={styles.projectsCon}>
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id}>
              <Card className={styles.cardProj} onClick={() => onNavigate(project.id)}>
                <div className={styles.topCon}>
                  <div className="d-flex align-items-center">
                    {project.is_active && (
                      <FontAwesomeIcon icon={faCircle} className={styles.greenBullet} size="xs" />
                    )}
                    <h2>{project.name}</h2>
                  </div>
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      showDeleteProjectModal(project.id);
                    }}
                  >
                    <FontAwesomeIcon className={styles.iconFon} icon={faTrash} />
                  </span>
                </div>
                <p>{project.description}</p>
              </Card>
            </div>
          ))
        ) : (
          <div className={styles.noCreated}>
            <p>It looks like your team haven't created any projects yet.</p>
            <p>
              Click on the "Create Project" button to get started and create your team's first
              project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpringBoardProjects;
