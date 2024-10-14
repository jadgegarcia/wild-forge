import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaPen } from 'react-icons/fa6';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import styles from './ProjectDetails.module.css';
import { useAuth } from '../../../../contexts/AuthContext';
import { useClassMemberTeam, useProjects } from '../../../../hooks';

const ProjectDetails = ({ project, numTemplates, onProjectUpdate, team_name, isClass }) => {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  const { updateProjects } = useProjects();

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

  const handleEditDetailModal = (projname, desc) => {
    Swal.fire({
      html: `
      <label style="font-size: 14px; font-weight: 400; ">Project Name:</label>
        <input type="text" id="input1" value="${
          projname ?? project.name
        }" placeholder="Enter new project name" class="swal2-input" style="height: 35px; width: 86%; font-size: 16px; font-family: 'Calibri', sans-serif; display: flex;"/>
        <br>
        <label style="font-size: 14px; font-weight: 400; ">Description:</label>
        <textarea id="input2" placeholder="Enter project description" class="swal2-textarea" style="margin: 0 auto; width: 86%; height: 100px; resize: none; font-size: 16px; font-family: 'Calibri', sans-serif;" >${
          desc ?? project.description
        }</textarea>
        <div id="charCount" style="text-align: right; color: #555; font-size: 12px; margin-top: 5px;">0/200 characters</div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#9c7b16',
      cancelButtonText: 'Close',
      cancelButtonColor: 'rgb(181, 178, 178)',
      didOpen: () => {
        const input2 = document.getElementById('input2');
        const charCount = document.getElementById('charCount');

        const updateCharCount = () => {
          const currentLength = input2.value.length;
          charCount.innerText = `${currentLength}/200 characters`;

          if (currentLength > 200) {
            input2.value = input2.value.slice(0, 200);
          }
        };

        updateCharCount();

        input2.addEventListener('input', updateCharCount);
      },
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
            const response = await updateProjects(project.id, {
              body: {
                name: input1Value,
                description: input2Value,
                team_id: project.team_id,
              },
            });

            if (response) {
              Swal.fire({
                title: 'Project Created',
                icon: 'success',
                confirmButtonColor: '#9c7b16',
              });
              onProjectUpdate();
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
  };

  // if (!team && !isClass) {
  //   return <Loading />;
  // }

  return (
    <div className={styles.side}>
      <p className={styles.title}>Overall Project Rating</p>
      <span className={styles.number}>
        {numTemplates > 0 ? Math.round((project.score / numTemplates) * 10) : 0} %
      </span>

      <hr />
      <div style={{ margin: '15px 0' }}>
        <p className={styles.title}>
          Project Details &nbsp;
          {user.role === 2 && project.team_id === teamId && (
            <span className={styles.pen} onClick={() => handleEditDetailModal()}>
              <FaPen />
            </span>
          )}
        </p>
        <p className={styles.title_body}>Name:</p>
        <p className={styles.bodyName}>{project.name}</p>
        <p className={styles.title_body}>Description:</p>
        <p className={styles.body}>{project.description}</p>
      </div>
      {(user.role === 1 || project.team_id !== teamId) && (
        <>
          <hr style={{ color: '#E5E4E2' }} />
          <p className={styles.title_body}>Created by: Group {team_name}</p>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
