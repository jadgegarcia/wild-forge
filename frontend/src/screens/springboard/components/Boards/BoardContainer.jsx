import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { FaCaretDown } from 'react-icons/fa';
import { Switch } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useAuth } from '../../../../contexts/AuthContext';
import Loading from '../../../../components/loading';
import ModalCustom from '../UI/Modal/Modal';
import Board from './Board';
import Button from '../UI/Button/Button';
import Caution from '../UI/Caution/Caution';
import { useClassMemberTeam, useProjects } from '../../../../hooks';
import styles from './Board.module.css';

const BoardContainer = ({
  selected,
  project,
  onProjectUpdate,
  setBoardTemplateIds,
  setCreateAction,
  setSelected,
  isClass,
  isTeacherSearch,
}) => {
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

  const { teamProjects, updateProjects } = useProjects();

  const [loadCount, setLoadCount] = useState(0);
  const [projectList, setProjectList] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const theme = createTheme({
    palette: {
      success: {
        main: '#87EE63',
        light: '#81c784',
        dark: '#388e3c',
        contrastText: '#242105',
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadCount((prevLoadCount) => prevLoadCount + 1);
        const result = await teamProjects(project.team_id);
        if (result.success) {
          setProjectList(result.data.projects);
        } else {
          console.error('Error fetching team projects:', result.error);
        }
      } catch (error) {
        console.error(`Error fetching data: ${error}`, error);
      }
    };
    if (!isClass && officialTeam) {
      sessionStorage.setItem('teamId', teamId);
    }
    fetchData();
  }, [selected, officialTeam]);

  // for changing the status of the teams other projects to inactive
  const updateProjectReasonStatus = async (proj, newreason) => {
    const newStatus = proj.is_active ? !proj.is_active : proj.is_active;
    try {
      if (newreason) {
        await updateProjects(proj.id, {
          body: {
            name: proj.name,
            reason: newreason,
            is_active: newStatus,
            team_id: proj.team_id,
          },
        });
      } else {
        Swal.fire('Error', 'Please provide a reason/s before proceeding.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Please provide a reason/s before proceeding.', 'error');
    }
  };

  // for toggling and updating the current project
  const toggleProjectPublic = async (proj, newreason) => {
    const newisActive = !proj.is_active;
    try {
      if (newreason) {
        await updateProjects(proj.id, {
          body: {
            name: proj.name,
            reason: newreason,
            is_active: newisActive,
            team_id: proj.team_id,
          },
        });
      } else {
        Swal.fire('Error', 'Please provide a reason/s before proceeding.', 'error');
      }
      onProjectUpdate();
    } catch (error) {
      Swal.fire('Error', 'Please provide a reason/s before proceeding.', 'error');
    }
  };

  const handleToggleClick = async () => {
    setIsModalOpen(true);
    if (!project.is_active) {
      setModalContent(
        <div className={styles.yScroll} style={{ textAlign: 'center' }}>
          <Caution />
          <h2>
            You are activating <b>"{project.name}"</b>
          </h2>

          <div className={styles.deac}>
            {projectList.length > 1 ? (
              <div>
                <p style={{ fontSize: '14px' }}>
                  You have {projectList.length - 1} other project in your group. Before activating
                  this project, please state a reason why the other projects are not
                  activated/discontinued.
                </p>
                {projectList
                  .filter((projectItem) => projectItem.id !== project.id)
                  .map((projectItem) => (
                    <div key={projectItem.id} style={{ textAlign: 'left' }}>
                      <p>
                        <b>{projectItem.name}</b>
                      </p>
                      <textarea
                        id={projectItem.id}
                        placeholder="State the reason"
                        defaultValue={projectItem.reason}
                        className={styles.textarea}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center' }}>Are you sure you want to activate this project?</p>
            )}
          </div>
          <div className={styles.btmButton}>
            <Button
              className={styles.button}
              style={{ backgroundColor: '#5fab3c' }}
              onClick={() => {
                let check = true;
                projectList
                  .filter((projectItem) => projectItem.id !== project.id)
                  .forEach((projectItem) => {
                    const textareaValue = document.getElementById(projectItem.id).value;
                    if (!textareaValue) {
                      check = false;
                    }
                    updateProjectReasonStatus(projectItem, textareaValue);
                  });
                if (check) {
                  toggleProjectPublic(project, 'None');
                }
                setIsModalOpen(false);
              }}
            >
              <p className={styles.confirmation}>Confirm</p>
            </Button>
            <Button
              className={styles.button}
              style={{ backgroundColor: 'rgb(181, 178, 178)' }}
              onClick={() => setIsModalOpen(false)}
            >
              <p className={styles.confirmation}>Cancel</p>
            </Button>
          </div>
        </div>
      );
    } else {
      // The project is already active
      setModalContent(
        <div style={{ textAlign: 'center' }}>
          <Caution />
          <h2>Are you sure you want to deactivate this project?</h2>
          <textarea id="input2" placeholder="State the reason" className={styles.textarea} />

          <div className={styles.btmButton}>
            <Button
              onClick={() => {
                const textareaValue = document.getElementById('input2').value;
                toggleProjectPublic(project, textareaValue);
                setIsModalOpen(false);
              }}
              className={styles.button}
              style={{ backgroundColor: '#8A252C' }}
            >
              <p className={styles.confirmation}>Deactivate</p>
            </Button>
            <Button className={styles.button} onClick={() => setIsModalOpen(false)}>
              <p className={styles.confirmation}>Cancel</p>
            </Button>
          </div>
        </div>
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDropdownClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!projectList) {
    return <Loading />;
  }

  return (
    <div className={styles.board}>
      {project ? (
        <>
          <ThemeProvider theme={theme}>
            <div className={styles.alignment}>
              <div className={styles.head}>{project.name} Boards</div>
              {user.role === 2 && project.team_id === teamId && (
                <div className={`${styles.publish} ${styles.rightAligned}`}>
                  {project.is_active ? 'Activated' : 'Inactive'}
                  <Switch
                    onChange={(event) => handleToggleClick(event)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={project.is_active}
                    color="success"
                  />
                </div>
              )}

              {user.role !== 2 && isClass && !isTeacherSearch && (
                <div>
                  <div className={styles.top} onClick={handleDropdownClick}>
                    <div className={styles.dropdown} ref={dropdownRef}>
                      <div className={styles.dropbtn}>
                        <span>View other project &nbsp;</span>
                        <FaCaretDown />
                      </div>
                      {dropdownVisible && (
                        <div className={styles.dropdowncontent}>
                          {projectList.map((proj) => (
                            <span
                              key={proj.id}
                              onClick={() => {
                                setSelected(proj.id);
                                setDropdownVisible(!dropdownVisible);
                              }}
                            >
                              {proj.is_active ? (
                                <FontAwesomeIcon
                                  icon={faCircle}
                                  className={styles.greenBullet}
                                  size="xs"
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faCircle}
                                  className={styles.clear}
                                  size="xs"
                                />
                              )}

                              <p style={{ padding: 0, margin: 0 }}>{proj.name}</p>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <hr />
            {user.role !== 1 && teamId === project.team_id && (
              <Button className={styles.butName} onClick={() => setCreateAction(true)}>
                <p className={styles.createName}> Create Board</p>
              </Button>
            )}
          </ThemeProvider>
          <Board
            selected={selected}
            project={project}
            onProjectUpdate={onProjectUpdate}
            setBoardTemplateIds={setBoardTemplateIds}
            isClass={isClass}
          />
        </>
      ) : loadCount === 0 ? (
        <Loading />
      ) : (
        <p className={styles.centeredText}>There's no project created in this group.</p>
      )}

      {/* ----------- */}
      {/* for modals */}
      {isModalOpen && (
        <ModalCustom width={500} isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent}
        </ModalCustom>
      )}
      {/* ----------- */}
    </div>
  );
};

export default BoardContainer;
