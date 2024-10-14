import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useAuth } from '../../../../contexts/AuthContext';
import Loading from '../../components/UI/Loading/Loading';
import Header from '../../components/Header/Header';
import ResultBoard from '../../components/ResultBoard/ResultBoard';
import Button from '../../components/UI/Button/Button';
import { useProjects } from '../../../../hooks';
import styles from './ViewBoard.module.css';

function ViewBoard() {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  const { getProject, getVersionProjectBoards } = useProjects();

  const [activeTab, setActiveTab] = useState('results');
  const [attempt, setAttempt] = useState(0);
  const [boards, setBoards] = useState(null);
  const [isGrpMem, setIsGrpMem] = useState(false);

  const teamId = sessionStorage.getItem('teamId');
  const { boardid } = useParams();
  const groupIdRef = useRef();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const calcAttempt = (versions) => {
    // Exclude the last item in the versions array. last item is the first version
    const versionsWithoutLast = versions.slice(0, -1);

    // Get today's date and set its time to 11:59 PM
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Set the end time today's date at 11:59 PM
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    // Set the start time before today's date at 11:59 PM
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const startDate = yesterday;

    const filteredBoards = versionsWithoutLast.filter((board) => {
      const boardCreatedAt = new Date(board.date_created);
      return boardCreatedAt >= startDate && boardCreatedAt <= endDate;
    });

    return filteredBoards.length;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVersionProjectBoards(boardid);
        const projectResponse = await getProject(response.data[0].project_id);
        const projectData = projectResponse.data.project;
        setBoards(response.data);
        groupIdRef.current = projectData.team_id;
        if (user.role === 2 && projectData.team_id === parseInt(teamId)) {
          setIsGrpMem(true);
        }
        setAttempt(calcAttempt(response.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [boardid]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const goToPreviousProjectBoard = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const goToNextProjectBoard = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleImproveRes = () => {
    if (attempt >= 3) {
      Swal.fire(
        'Warning',
        'You have reached the maximum limit of 3 reassessments for today. Please try again tomorrow.',
        'warning'
      );
    } else {
      navigate('edit');
    }
  };

  const handleBack = () => {
    const storedPath = sessionStorage.getItem('goToClass');
    navigate(storedPath);
  };

  if (!boards) {
    return <Loading />;
  }

  const currentProjectBoard = boards[currentIndex];

  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.subbody}>
        <div className={styles.subsubbody} style={{ width: '70rem' }}>
          <h2>
            <span className={styles.back} onClick={handleBack}>
              <IoArrowBackSharp />
            </span>
            {currentProjectBoard.title}
          </h2>
          <div className={styles.navigationButtons}>
            <span
              onClick={goToNextProjectBoard}
              className={currentIndex === boards.length - 1 ? styles.disabled : styles.enable}
            >
              &lt;&lt;
            </span>
            <span>&nbsp; Version {boards.length - currentIndex} &nbsp; </span>
            <span
              onClick={goToPreviousProjectBoard}
              className={currentIndex === 0 ? styles.disabled : styles.enable}
            >
              &gt;&gt;
            </span>
          </div>

          <div className={styles.tabsContainer}>
            <div
              className={`${styles.tab} ${activeTab === 'results' ? styles.active : ''}`}
              onClick={() => handleTabClick('results')}
            >
              Result
            </div>
            <div
              className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => handleTabClick('details')}
            >
              Details
            </div>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'results' && (
              <>
                <div className={styles.tabHeader}>
                  <p>Result</p>
                </div>
                <div style={{ minHeight: '10rem' }}>
                  <ResultBoard boardid={currentProjectBoard.id} />
                </div>
              </>
            )}
            {activeTab === 'details' && (
              <>
                <div className={styles.tabHeader}>
                  <p>{currentProjectBoard.title}</p>
                </div>
                <div style={{ minHeight: '10rem' }}>{parse(currentProjectBoard.content)}</div>
              </>
            )}
          </div>
        </div>

        {user.role === 2 && isGrpMem && (
          <div className={styles.btmButton}>
            <p style={{ color: 'red' }}>Reassesments available today: {3 - attempt} / 3</p>

            <Button className={styles.button} onClick={handleImproveRes}>
              Improve Result
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewBoard;
