import 'primeicons/primeicons.css';
import '../index.scss';
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useActivities, useClassMemberTeam, useTeams, useClassMember } from '../../../../hooks';
import { ActivityCard } from '../../../../components/cards/activity_cards';

const Student = () => {
  const navigate = useNavigate();
  const { classId, user } = useOutletContext();
  const { teams } = useTeams(classId);
  const [unfilteredActivities, setUnfilteredActivities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [allActivities, setAllActivities] = useState(null);
  const [activities, setActivities] = useState(null);
  const { isLoading, activities: activitiesFromHook } = useActivities(classId);
  const [groupActsByTeam, setGroupActsByTeam] = useState({});
  const { team } = useClassMember(classId, user?.user_id);

  const setActivitiesAndUnfiltered = (_activities) => {
    setActivities(_activities);
    setUnfilteredActivities(_activities);
    setSelectedFilter(0);
  };

  const handleToSelectedActivity = (teamId, actId) => {
    navigate(`/classes/${classId}/activities/${actId}/teams/${teamId}`);
  };

  const handleFilterActivities = (filter) => {
    let filteredActivities;

    switch (filter) {
      case 0:
        setActivities(unfilteredActivities);

        setSelectedFilter(0);
        break;
      case 1:
        filteredActivities = unfilteredActivities.filter((activity) => activity.submission_status);
        setActivities(filteredActivities);
        setSelectedFilter(1);
        break;
      case 2:
        filteredActivities = unfilteredActivities.filter((activity) => !activity.submission_status);
        setActivities(filteredActivities);
        setSelectedFilter(2);
        break;
      default:
        break;
    }
  };

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);

    // the id is passed
    // if a team is selected, then filter the activities by team
    // it will directly show the activities of the selected team
    // if the team is all, then show all the activities

    const filteredActivities = allActivities.filter((activity) =>
      activity.team_id.includes(Number(teamId))
    );

    // setActivitiesAndUnfiltered(filteredActivities);

    setActivitiesAndUnfiltered(filteredActivities);
  };

  useEffect(() => {
    if (activities) {
      const groupedActivities = activities.reduce((groups, activity) => {
        activity.team_id.forEach((teamId) => {
          if (selectedTeam !== 'All' && Number(selectedTeam) !== teamId) {
            return groups;
          }
          if (!groups[teamId]) {
            groups[teamId] = [];
          }
          groups[teamId].push(activity);
        });
        return groups;
      }, {});
      setGroupActsByTeam(groupedActivities);
    }
  }, [activities, selectedTeam]);

  useEffect(() => {
    if (!isLoading) {
      setActivities(activitiesFromHook);
      setUnfilteredActivities(activitiesFromHook);
      setAllActivities(activitiesFromHook);
    }
  }, [isLoading, activitiesFromHook]);

  return (
    <div className="container-md">
      <div className="container-md d-flex flex-column gap-3 mt-5 pr-3 pl-3">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row">
            <h4 className="fw-bold m-0">Activities</h4>
          </div>
          <div className="d-flex flex-row gap-3 " />
        </div>
        <hr className="text-dark" />

        <div className="d-flex flex-row gap-3 ">
          <div className="input-group align-items-center">
            <input
              type="text"
              className="form-control border-dark"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="d-flex flex-row gap-3 align-items-center w-25">
            <label htmlFor="teamFilter" className="m-0">
              Team:
            </label>
            <select
              id="teamFilter"
              className="form-select border-dark"
              onChange={(e) => handleTeamChange(e.target.value)}
              value={selectedTeam}
            >
              {team && (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              )}
            </select>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          {activities ? (
            <>
              <div className="d-flex flex-row gap-3">
                <button
                  className={`btn ${
                    selectedFilter === 0 ? 'btn-activity-active' : 'btn-activity-inactive'
                  } bw-3 m-0 col-md-2`}
                  onClick={() => handleFilterActivities(0)}
                >
                  All
                </button>
                <button
                  className={`btn ${
                    selectedFilter === 1 ? 'btn-activity-active' : 'btn-activity-inactive'
                  } bw-3 m-0 col-md-2`}
                  onClick={() => handleFilterActivities(1)}
                >
                  Submitted
                </button>
                <button
                  className={`btn ${
                    selectedFilter === 2 ? 'btn-activity-active' : 'btn-activity-inactive'
                  } bw-3 m-0 col-md-2`}
                  onClick={() => handleFilterActivities(2)}
                >
                  Unsubmitted
                </button>
              </div>
              <div className="d-flex flex-column gap-3">
                {groupActsByTeam[team?.id]?.map((act, index) => (
                  <ActivityCard
                    key={act.id}
                    {...act}
                    onClick={() => handleToSelectedActivity(team?.id, act.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p> NO ACTIVITY</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;
