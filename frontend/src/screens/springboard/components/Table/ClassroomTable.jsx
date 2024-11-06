import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import SortButton from '../UI/SortButton/SortButton';
import Card from '../UI/Card/Card';
import { useBoardTemplate } from '../../../../hooks';
import styles from './Table.module.css';

const ClassroomTable = (props) => {
  const { classId } = useOutletContext();
  const { getAllTemplate } = useBoardTemplate();

  const [teams, setTeams] = useState(null);
  const [sortOrder, setSortOrder] = useState(true); // true for ascending, false for descending
  const [teanNameSortOrder, setTeamNameSortOrder] = useState(true); // true for ascending, false for descending
  const [projectNameSortOrder, setProjectNameSortOrder] = useState(true); // true for ascending, false for descending
  const [dateSort, setDateSort] = useState(true);
  const [templateSort, setTemplateSort] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [templates, setTemplates] = useState([]);
  const [templateSortOrder, setTemplateSortOrder] = useState({}); // object to keep track of sort order for each template
  const [currentPage, setCurrentPage] = useState(() => {
    // Use a function to initialize the state with the value from sessionStorage
    const savedPage = sessionStorage.getItem('classPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [sharedState, setSharedState] = useState(true);
  const teamsPerPage = 10;
  const navigate = useNavigate();

  const activate = (state) => {
    setTeamNameSortOrder(state === 1 ? teanNameSortOrder : true);
    setProjectNameSortOrder(state === 2 ? projectNameSortOrder : true);
    setSortOrder(state === 3 ? sortOrder : true);
    setDateSort(state === 4 ? dateSort : true);
    setTemplateSort(state > 4 ? templateSort : true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templatesResponse = await getAllTemplate();
        const templatesData = templatesResponse.data;
        setTemplates(templatesData);
        const initialSortOrder = {};
        templatesData.forEach((template) => {
          initialSortOrder[template.id] = true;
        });
        setTemplateSortOrder(initialSortOrder);
        const sortedGroups = [...props.teams].sort((a, b) => {
          const aTime = a.projects.length > 0 ? new Date(a.projects[0].project_date_created) : null;
          const bTime = b.projects.length > 0 ? new Date(b.projects[0].project_date_created) : null;
          if (aTime && bTime) {
            return !dateSort ? aTime - bTime : bTime - aTime;
          }
          if (!aTime && !bTime) {
            return 0;
          }
          if (!aTime) {
            return 1;
          }
          return -1;
        });
        setTeams(sortedGroups);
        setSharedState(0);
        activate(0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props]);

  useEffect(() => {
    // Save the current page to localStorage whenever it changes
    sessionStorage.setItem('classPage', currentPage.toString());
  }, [currentPage]);

  const handleGroupNameSort = () => {
    setSharedState(1);
    activate(1);
    const sortedGroups = [...teams].sort((a, b) =>
      !teanNameSortOrder
        ? a.team_name.localeCompare(b.team_name)
        : b.team_name.localeCompare(a.team_name)
    );
    setTeams(sortedGroups);
    setTeamNameSortOrder(!teanNameSortOrder);
  };

  const handleProjectNameSort = () => {
    setSharedState(2);
    activate(2);

    const sortedGroups = [...teams].sort((a, b) => {
      const aProjectName = a.projects.length > 0 ? a.projects[0].project_name : '';
      const bProjectName = b.projects.length > 0 ? b.projects[0].project_name : '';

      if (a.projects.length === 0 && b.projects.length === 0) {
        return 0;
      }

      if (a.projects.length === 0) {
        return 1;
      }

      if (b.projects.length === 0) {
        return -1;
      }

      return !projectNameSortOrder
        ? aProjectName.localeCompare(bProjectName)
        : bProjectName.localeCompare(aProjectName);
    });

    setTeams(sortedGroups);
    setProjectNameSortOrder(!projectNameSortOrder);
  };

  const handleTimeSort = () => {
    setSharedState(4);
    activate(4);

    const sortedGroups = [...teams].sort((a, b) => {
      const aTime = a.projects.length > 0 ? new Date(a.projects[0].project_date_created) : null;
      const bTime = b.projects.length > 0 ? new Date(b.projects[0].project_date_created) : null;

      if (aTime && bTime) {
        return !dateSort ? aTime - bTime : bTime - aTime;
      }

      if (!aTime && !bTime) {
        return 0;
      }

      if (!aTime) {
        return 1;
      }

      return -1;
    });

    setTeams(sortedGroups);
    setDateSort(!dateSort);
  };

  const handleSort = () => {
    setSharedState(3);
    activate(3);
    const sortedGroups = [...teams].sort((a, b) => {
      const aScore = a.projects.length > 0 ? a.projects[0].project_score / templates.length : 0;
      const bScore = b.projects.length > 0 ? b.projects[0].project_score / templates.length : 0;
      return !sortOrder ? aScore - bScore : bScore - aScore;
    });
    setTeams(sortedGroups);
    setSortOrder(!sortOrder);
  };

  const handleTemplateSort = (templateId) => {
    setSharedState(templateId + 4);
    activate(templateId + 4);
    if (templateId !== sharedState - 4) {
      setTemplateSort(true);
    }
    const sortedGroups = [...teams].sort((a, b) => {
      const aBoard =
        a.projects.length > 0
          ? a.projects[0].project_boards.find((board) => board.template_id === templateId)
          : null;
      const bBoard =
        b.projects.length > 0
          ? b.projects[0].project_boards.find((board) => board.template_id === templateId)
          : null;
      const aScore = aBoard ? aBoard.board_score : 0;
      const bScore = bBoard ? bBoard.board_score : 0;
      return !templateSort ? aScore - bScore : bScore - aScore;
    });
    setTeams(sortedGroups);
    setTemplateSort(!templateSort);
    setTemplateSortOrder({
      ...templateSortOrder,
      [templateId]: !templateSortOrder[templateId],
    });
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

  const totalPageCount = Math.ceil(teams.length / teamsPerPage);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const endIndex = startIndex + teamsPerPage;

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setTeams(props.teams);
      return;
    }
    const filteredGroups = props.teams.filter((group) =>
      group.team_name.toLowerCase().includes(text.toLowerCase())
    );

    setTeams(filteredGroups);
  };

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

  // Get the teams for the current page
  const groupsToDisplay = teams.slice(startIndex, endIndex);

  const onClickNavigation = (id) => {
    navigate(`/classes/${classId}/team/${id}`);
  };

  return (
    <div style={{ maxWidth: '70rem' }}>
      <Card className={styles.card}>
        <div className={`${styles.headerSection}`} style={{ backgroundColor: '#9c7b16' }}>
          <input
            type="text"
            className={styles.Search}
            value={searchText}
            onChange={(event) => {
              const searchedText = event.target.value;
              handleSearch(searchedText);
            }}
            placeholder="Search team"
            onClick={() => handleSearch(searchText)}
          />
        </div>
        <div className={styles.xScroll}>
          <div
            className={`${styles.container}`}
            style={{
              borderBottom: '1px solid #9c7b16',
              color: '#BCBEC0',
              marginBottom: '10px',
              gridTemplateColumns: `repeat(${2}, 11rem) 20rem 11rem repeat(${
                templates.length
              }, 11rem) 11rem`,
            }}
          >
            <span
              className={`${styles.centerText} ${styles.clickable}`}
              onClick={handleGroupNameSort}
            >
              Team Name
              <SortButton isActive={sharedState === 1} sort={teanNameSortOrder} />
            </span>
            <span
              className={`${styles.centerText} ${styles.clickable}`}
              onClick={handleProjectNameSort}
            >
              Project
              <SortButton isActive={sharedState === 2} sort={projectNameSortOrder} />
            </span>
            <span className={`${styles.centerText}`}>Description</span>
            <span className={`${styles.centerText} ${styles.clickable}`} onClick={handleSort}>
              Overall Rating
              <SortButton isActive={sharedState === 3} sort={sortOrder} />
            </span>
            {templates.map((template, index) => (
              <span
                key={index}
                className={`${styles.centerText} ${styles.clickable}`}
                onClick={() => handleTemplateSort(template.id)}
              >
                {template.title}
                <SortButton isActive={sharedState === 4 + template.id} sort={templateSort} />
              </span>
            ))}
            <span className={`${styles.centerText} ${styles.clickable}`} onClick={handleTimeSort}>
              Date Created
              <SortButton isActive={sharedState === 4} sort={dateSort} />
            </span>
          </div>
          <div className={styles.yScroll}>
            {props.teams.length === 0 && groupsToDisplay.length === 0 && (
              <div className={styles.noTeamMessage}>There are no teams.</div>
            )}
            {props.teams.length > 0 && groupsToDisplay.length === 0 && (
              <div className={styles.noTeamMessage}>No team under that name.</div>
            )}

            {groupsToDisplay.map((group) => (
              <div
                className={`${styles.groupContainer} ${styles.conHover}`}
                style={{
                  gridTemplateColumns: `repeat(${2}, 11rem) 20rem 11rem repeat(${
                    templates.length
                  }, 11rem) 11rem`,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                }}
                key={group.team_idid}
              >
                <span
                  className={styles.centerTextName}
                  onClick={() => onClickNavigation(group.team_id)}
                >
                  {group.team_name}
                </span>

                {group.projects.length > 0 ? (
                  <>
                    <span className={styles.centerText}>{group.projects[0].project_name}</span>
                    <span className={styles.centerText}>
                      {group.projects[0].project_description}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.centerText}>No Active Project</span>
                    <span className={styles.centerText}>No Description</span>
                  </>
                )}

                <span className={styles.centerText} style={{ color: 'red' }}>
                  {group.projects.length > 0
                    ? `${Math.round((group.projects[0].project_score / templates.length) * 10)}%`
                    : '0%'}
                </span>

                {templates.map((template, index) => {
                  const projectBoard =
                    group.projects.length > 0
                      ? group.projects[0].project_boards.find(
                          (board) => board.template_id === template.id
                        )
                      : null;
                  return (
                    <span key={index} className={styles.centerText}>
                      {projectBoard ? `${Math.round(projectBoard.board_score * 10)}%` : '0%'}
                    </span>
                  );
                })}
                {group.projects.length > 0 ? (
                  <span className={styles.centerText}>
                    {time(group.projects[0].project_date_created)}
                  </span>
                ) : (
                  <span className={styles.centerText}>---</span>
                )}
              </div>
            ))}
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
};

export default ClassroomTable;
