import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Fuse from 'fuse.js';
import SortButton from '../UI/SortButton/SortButton';
import Card from '../UI/Card/Card';
import { useBoardTemplate, useProjects } from '../../../../hooks';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from './Table.module.css';

function PublicTable(props) {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  const { getAllTemplate } = useBoardTemplate();
  const { userProjects } = useProjects();

  const [userProjs, setUserProjs] = useState(null);
  const [teams, setTeams] = useState(null);
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState(true); // true for ascending, false for descending
  const [teamNameSortOrder, setTeamNameSortOrder] = useState(true); // true for ascending, false for descending
  const [projectNameSortOrder, setProjectNameSortOrder] = useState(true); // true for ascending, false for descending
  const [dateSort, setDateSort] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [filteredSearchTeam, setFilteredSearchTeam] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    // Use a function to initialize the state with the value from localStorage
    const savedPage = sessionStorage.getItem('activeProjPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [searchText, setSearchText] = useState('');
  const [sharedState, setSharedState] = useState(true);
  const groupsPerPage = 15;
  const navigate = useNavigate();

  const activate = (state) => {
    setTeamNameSortOrder(state === 1 ? teamNameSortOrder : true);
    setProjectNameSortOrder(state === 2 ? projectNameSortOrder : true);
    setSortOrder(state === 3 ? sortOrder : true);
    setDateSort(state === 4 ? dateSort : true);
  };

  const handleSearch = (text) => {
    setSearchText(text);

    if (text) {
      const fuse = new Fuse(props.allProjects, {
        keys: ['projects.project_name', 'projects.project_description'],
        includeScore: true,
        threshold: 0.5,
      });

      const result = fuse.search(text);
      const sortedResults = result.map((item) => item.item).sort((a, b) => b.score - a.score); // Sort in descending order based on score
      setFilteredSearchTeam(sortedResults);
      return sortedResults;
    }

    setFilteredSearchTeam(teams);
    return teams;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchValue = searchParams.get('search') || '';
        let tempProjects = props.allProjects;
        setSearchText(searchValue);
        if (searchValue) {
          tempProjects = handleSearch(searchValue);
        } else {
          searchParams.set('search', searchText);
        }
        const filteredTeams = tempProjects.filter((team) =>
          team.projects.length > 0 ? team.projects[0].project_is_active === props.isActive : false
        );
        const sortedTeams = [...filteredTeams].sort((a, b) => {
          const aTime = a.projects.length > 0 ? new Date(a.projects[0].project_date_created) : null;
          const bTime = b.projects.length > 0 ? new Date(b.projects[0].project_date_created) : null;

          if (aTime && bTime) {
            return !dateSort ? aTime - bTime : bTime - aTime;
          }
          if (aTime) {
            return dateSort ? -1 : 1;
          }
          if (bTime) {
            return dateSort ? 1 : -1;
          }
          return 0;
        });
        setTeams(sortedTeams);
        setFilteredSearchTeam(sortedTeams);

        setSharedState(0);
        activate(0);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }

      try {
        const templateResponse = await getAllTemplate();
        setTemplates(templateResponse.data);
        const userProjResponse = await userProjects(user.user_id);
        setUserProjs(userProjResponse.data);
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    fetchData();
  }, [props, location.search]);

  useEffect(() => {
    // Save the current page to localStorage whenever it changes
    sessionStorage.setItem('activeProjPage', currentPage.toString());
  }, [currentPage]);

  const handleGroupNameSort = () => {
    setSharedState(1);
    activate(1);
    const sortedTeams = [...filteredSearchTeam].sort((a, b) =>
      !teamNameSortOrder
        ? a.team_name.localeCompare(b.team_name)
        : b.team_name.localeCompare(a.team_name)
    );
    setFilteredSearchTeam(sortedTeams);
    setTeamNameSortOrder(!teamNameSortOrder);
  };

  const handleProjectNameSort = () => {
    setSharedState(2);
    activate(2);
    const sortedTeams = [...filteredSearchTeam].sort((a, b) => {
      const aProjectName = a.projects.length > 0 ? a.projects[0].project_name : '';
      const bProjectName = b.projects.length > 0 ? b.projects[0].project_name : '';
      return !projectNameSortOrder
        ? aProjectName.localeCompare(bProjectName)
        : bProjectName.localeCompare(aProjectName);
    });
    setFilteredSearchTeam(sortedTeams);
    setProjectNameSortOrder(!projectNameSortOrder);
  };

  const handleSort = () => {
    setSharedState(3);
    activate(3);
    const sortedTeams = [...filteredSearchTeam].sort((a, b) => {
      const aScore = a.projects.length > 0 ? a.projects[0].project_score / templates.length : 0;
      const bScore = b.projects.length > 0 ? b.projects[0].project_score / templates.length : 0;
      return !sortOrder ? aScore - bScore : bScore - aScore;
    });
    setFilteredSearchTeam(sortedTeams);
    setSortOrder(!sortOrder);
  };

  const handleTimeSort = () => {
    setSharedState(4);
    activate(4);
    const sortedTeams = [...filteredSearchTeam].sort((a, b) => {
      const aTime = a.projects.length > 0 ? new Date(a.projects[0].project_date_created) : null;
      const bTime = b.projects.length > 0 ? new Date(b.projects[0].project_date_created) : null;

      if (aTime && bTime) {
        return (dateSort ? 1 : -1) * (aTime - bTime);
      }
      if (aTime) {
        return dateSort ? -1 : 1;
      }
      if (bTime) {
        return dateSort ? 1 : -1;
      }
      return 0;
    });
    setFilteredSearchTeam(sortedTeams);
    setDateSort(!dateSort);
  };

  const time = (timestamp) => {
    const dateObject = new Date(timestamp);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const year = dateObject.getFullYear();
    const month = monthNames[dateObject.getMonth()]; // Use the array to get the month name
    const day = dateObject.getDate().toString().padStart(2, '0');
    const dateOnlyString = `${month} ${day}, ${year}`;
    return dateOnlyString;
  };

  if (!teams || !templates) {
    return <p>Loading...</p>;
  }

  const totalPageCount = Math.ceil(teams.length / groupsPerPage);
  const startIndex = (currentPage - 1) * groupsPerPage;
  const endIndex = startIndex + groupsPerPage;

  const handleNextPage = () => {
    if (currentPage < totalPageCount) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const onClickNavigation = (classId, projId) => {
    const currentPathWithQuery = `${window.location.pathname}${window.location.search}`;
    sessionStorage.setItem('prevUrlSearch', currentPathWithQuery);

    if (userProjs.some((project) => project.id === projId)) {
      navigate(`/classes/${classId}/project/${projId}`);
    } else {
      navigate(`search-project/${projId}`);
    }
  };

  // Get the teams for the current page
  const teamsToDisplay = filteredSearchTeam.slice(startIndex, endIndex);

  return (
    <div style={{ maxWidth: '70rem' }}>
      <Card className={styles.card}>
        <div className={`${styles.headerSection}`} style={{ backgroundColor: '#9c7b16' }}>
          <p className={styles.header}> List of Projects </p>
          <input
            type="text"
            className={styles.Search}
            style={{ width: '25rem' }}
            value={searchText}
            onChange={(event) => {
              const searchedText = event.target.value;
              if (searchText.length > 0 && searchedText === '') {
                handleSearch(searchedText);
                const searchParams = new URLSearchParams();
                searchParams.set('search', searchedText);
                // Navigate to the updated URL
                navigate(`${location.pathname}?${searchParams.toString()}`);
              }
              setSearchText(searchedText);
            }}
            placeholder="Search"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                const searchParams = new URLSearchParams();
                searchParams.set('search', searchText);
                // Navigate to the updated URL
                navigate(`${location.pathname}?${searchParams.toString()}`);
              }
            }}
          />
        </div>
        <div className={styles.xScroll}>
          <div
            className={`${styles.container} `}
            style={{
              borderBottom: '1px solid #9c7b16',
              color: '#BCBEC0',
              marginBottom: '10px',
              gridTemplateColumns:
                !props.isActive && `repeat(${2}, 11rem) 20rem 10rem 18rem 11rem 10rem`,
              gridColumnGap: '5px',
            }}
          >
            <span
              className={`${styles.centerText} ${styles.clickable}`}
              onClick={handleGroupNameSort}
            >
              Team Name
              <SortButton isActive={sharedState === 1} sort={teamNameSortOrder} />
            </span>
            <span
              className={`${styles.centerText} ${styles.clickable}`}
              onClick={handleProjectNameSort}
            >
              Project
              <SortButton isActive={sharedState === 2} sort={projectNameSortOrder} />
            </span>
            <span className={`${styles.centerText} `}>Description</span>
            <span className={`${styles.centerText} ${styles.clickable}`} onClick={handleSort}>
              Overall Rating
              <SortButton isActive={sharedState === 3} sort={sortOrder} />
            </span>
            {!props.isActive && (
              <span className={styles.centerText}>Reason for discontinuing the project</span>
            )}
            <span className={`${styles.centerText} `}>Handled By</span>
            <span className={`${styles.centerText} ${styles.clickable}`} onClick={handleTimeSort}>
              Date Created
              <SortButton isActive={sharedState === 4} sort={dateSort} />
            </span>
          </div>
          <div className={styles.yScroll}>
            {teamsToDisplay.length > 0 ? (
              teamsToDisplay.map((team, index) => (
                <div
                  className={`${styles.groupContainer} ${styles.conHover}`}
                  style={{
                    gridTemplateColumns:
                      !props.isActive && `repeat(${2}, 11rem) 20rem 10rem 18rem 11rem 10rem`,
                    gridColumnGap: '5px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                  key={index}
                >
                  <span className={styles.centerText}>{team.team_name}</span>

                  {team.projects.length > 0 ? (
                    <span
                      className={styles.centerTextName}
                      onClick={() =>
                        onClickNavigation(team.classroom_id, team.projects[0].project_id)
                      }
                    >
                      {team.projects[0].project_name}
                    </span>
                  ) : (
                    <span className={styles.centerText}>No Project </span>
                  )}
                  <span className={styles.centerText}>{team.projects[0].project_description}</span>

                  <span className={styles.centerText} style={{ color: 'red' }}>
                    {team.projects.length > 0
                      ? `${Math.round((team.projects[0].project_score / templates.length) * 10)}%`
                      : '0%'}
                  </span>
                  {!props.isActive && (
                    <span className={styles.centerText}>{team.projects[0].project_reason}</span>
                  )}

                  <span className={styles.centerText}>{team.teacher_info}</span>
                  <span className={styles.centerText}>
                    {team.projects.length > 0 ? (
                      time(team.projects[0].project_date_created)
                    ) : (
                      <span>---</span>
                    )}
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.noTeamMessage}>
                Sorry! We looked everywhere, but could not find any project.
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className={styles.pagination}>
        <span onClick={handlePreviousPage} className={currentPage === 1 ? styles.disabled : ''}>
          &lt;&lt;
        </span>
        <span>&nbsp; {currentPage} &nbsp; </span>
        <span
          onClick={handleNextPage}
          className={currentPage === totalPageCount ? styles.disabled : ''}
        >
          &gt;&gt;
        </span>
      </div>
    </div>
  );
}

export default PublicTable;
