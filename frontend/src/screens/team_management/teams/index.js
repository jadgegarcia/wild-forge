import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import Swal from 'sweetalert2';
import { useTeams, useClassMemberTeam } from '../../../hooks';

import GLOBALS from '../../../app_globals';

import Table from '../../../components/table';
import AddLeaders from '../../../components/modals/add_leaders';
import CreateTeam from '../../../components/modals/create_team';
import Search from '../../../components/search';
import ApplyTeam from '../../../components/modals/apply_team';

import './index.scss';
import AssignNewLeader from '../../../components/modals/assign_new_leader';
import UpdateTeam from '../../../components/modals/update_team';
import { copyToClipBoard } from '../../../utils/copyToClipBoard';

function Teams() {
  const { user, classId, classMember, classRoom } = useOutletContext();

  const {
    teams,
    leaders,
    acceptLeader,
    removeLeader,
    setLeader,
    joinTeam,
    openTeams,
    closeTeams,
    leaveTeam,
    acceptTeamMember,
    removeTeamMember,
  } = useTeams(classId);

  const { deleteTeam } = useTeams(classId);

  const [showNotif, setShowNotif] = useState(false);
  const [isAddLeadersModalOpen, setAddLeadersModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [isUpdateTeamModalOpen, setUpdateTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isSelectedTeam, setIsSelectedTeam] = useState(false);

  const [selectedTeamStatus, setSelectedTeamStatus] = useState(0);

  const [currentLeaderId, setCurrentLeaderId] = useState(null);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [currentTeamMembers, setCurrentTeamMembers] = useState([]);
  const [isLeavingTeam, setIsLeavingTeam] = useState(false);

  const teamLeaderHeaders = ['id', 'name', 'status'];
  const teamsHeaders = ['id', 'team', 'leader', 'members', 'actions'];
  const membersHeaders = ['id', 'name', 'role', 'actions'];

  const [teamLeaderTableData, setTeamLeaderTableData] = useState([]);
  const [teamsTableData, setTeamsTableData] = useState([]);
  const [membersTableData, setMembersTableData] = useState([]);

  // move to teacher and student with no team content
  useEffect(() => {
    if (teams) {
      const teamsData = teams.map((team) => {
        const { id, name, team_members } = team;

        const leader = team_members.find(
          (team_member) => team_member.role === GLOBALS.TEAMMEMBER_ROLE.LEADER
        );
        const members = team_members.filter(
          (member) => member.status === GLOBALS.MEMBER_STATUS.ACCEPTED
        ).length;

        return {
          id,
          team: name,
          leader: `${leader?.first_name} ${leader?.last_name}`,
          members,
          actions: (
            <>
              <button
                type="button"
                className="btn btn-sm fw-bold text-success"
                onClick={() => {
                  setIsSelectedTeam(true);
                  setSelectedTeam(team);
                }}
              >
                VIEW
              </button>
              {user?.role === GLOBALS.USER_ROLE.MODERATOR && (
                <button
                  type="button"
                  className="btn btn-sm fw-bold text-danger"
                  onClick={() => {
                    Swal.fire({
                      title: 'Are you sure?',
                      text: 'You will not be able to recover this Team!',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'Yes, delete it!',
                      cancelButtonText: 'No, keep it',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        deleteTeam();
                      } else {
                        Swal.fire('Cancelled', 'Your team is safe :)', 'error');
                      }
                    });
                  }}
                >
                  DELETE
                </button>
              )}
            </>
          ),
        };
      });

      setTeamsTableData(teamsData);
    }
  }, [teams]);

  useEffect(() => {
    if (leaders) {
      const leadersData = leaders.map((l) => {
        const { class_member_id, first_name, last_name, teamember_status } = l;

        return {
          id: class_member_id,
          name: `${first_name} ${last_name}`,
          status: teamember_status === GLOBALS.MEMBER_STATUS.ACCEPTED ? 'ACCEPTED' : 'PENDING',
        };
      });

      setTeamLeaderTableData(leadersData);
    }
  }, [leaders]);

  const openAddLeadersModal = () => {
    setAddLeadersModalOpen(true);
  };

  const closeAddLeadersModal = () => {
    setAddLeadersModalOpen(false);
  };

  const handleCopyCode = () => {
    try {
      copyToClipBoard(classRoom?.class_code);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChangeTeamStatus = (event, teamId) => {
    const selectedStatus = parseInt(event.target.value);
    setSelectedTeamStatus(selectedStatus);
    if (selectedStatus === GLOBALS.TEAM_STATUS.OPEN) {
      openTeams(teamId);
    } else {
      closeTeams(teamId);
    }
  };

  const getColorClass = () => {
    if (selectedTeamStatus === GLOBALS.TEAM_STATUS.OPEN) {
      return 'text-success';
    }
    if (selectedTeamStatus === GLOBALS.TEAM_STATUS.CLOSE) {
      return 'text-danger';
    }
    return 'text-default';
  };

  const renderTable = (headerData, tableData, emptyMessage) => (
    <div className="d-flex flex-column pt-3 pb-3 px-5 table-body">
      {tableData.length === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Table headers={headerData} data={tableData} className="mt-3" />
          <div className="brown-text fw-bold fs-5 py-2 mx-5">{emptyMessage}</div>
        </div>
      ) : (
        <Table headers={headerData} data={tableData} className="mt-3" />
      )}
    </div>
  );

  const renderTeamData = (team) => (
    <div>
      <div className="d-flex flex-column">
        <div className="fw-bold fs-3 px-5 py-3">{team.name}</div>
        <div className="fw-semibold fs-7 px-5 text-secondary">
          TEAM CODE: team-{(team.id * 133337).toString(16)}
        </div>
      </div>
      <div className="px-5 py-3 lh-lg text-justify">
        {team.description || 'No description yet.'}
      </div>
      <div className="container">
        <div className="fw-bold fs-4 px-5 py-3">Members</div>
        {renderTable(membersHeaders, membersTableData, "There's no members yet.")}
      </div>
    </div>
  );

  const [activeTab, setActiveTab] = useState('teamLeaders');

  const renderTeacherTeamManagement = () => (
    <div className="d-flex flex-column pt-3 pb-3 px-5">
      <ul className="nav nav-underline">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teamLeaders' ? 'active' : ''}`}
            onClick={() => setActiveTab('teamLeaders')}
          >
            Team Leaders
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Teams
          </button>
        </li>
      </ul>
      {activeTab === 'teamLeaders' && (
        <>
          <div className="d-flex justify-content-end ms-auto p-2">
            <button
              type="button"
              className="btn btn-yellow-primary fw-semibold"
              onClick={openAddLeadersModal}
            >
              Add Leaders
            </button>
          </div>
          {renderTable(teamLeaderHeaders, teamLeaderTableData, 'No Leaders Identified Yet.')}
        </>
      )}
      {activeTab === 'teams' && (
        <>{renderTable(teamsHeaders, teamsTableData, 'No Teams Formed Yet.')}</>
      )}
      {isSelectedTeam && (
        <div className="modal-apply-team p-4">
          <ApplyTeam
            visible={isSelectedTeam}
            handleModal={() => setIsSelectedTeam(false)}
            teamData={selectedTeam}
            isViewOnly={false}
          />
        </div>
      )}
    </div>
  );

  const renderTeamLeaderNoTeam = () => (
    <div className="d-flex flex-column pt-3 pb-3 px-5">
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-yellow-primary fw-semibold btn-lg"
          onClick={() => setCreateTeamModalOpen(true)}
        >
          Create Team
        </button>
      </div>
      <CreateTeam
        visible={isCreateTeamModalOpen}
        handleModal={() => setCreateTeamModalOpen(false)}
      />
    </div>
  );

  const renderStudentNoTeam = () => (
    <div className="d-flex flex-column pt-3 pb-3 px-5">
      {renderTable(teamsHeaders, teamsTableData, 'No Teams Formed Yet.')}
      {isSelectedTeam && (
        <ApplyTeam
          visible={isSelectedTeam}
          handleModal={() => setIsSelectedTeam(false)}
          teamData={selectedTeam}
          applyToTeam={joinTeam}
        />
      )}
    </div>
  );

  let subheaderContent;
  let bodyContent;

  /// TEACHER section
  if (classMember.role === GLOBALS.CLASSMEMBER_ROLE.TEACHER) {
    subheaderContent = (
      <div className="d-flex pt-2 pb-2">
        <div className="px-5">
          <div className="d-flex align-items-center fw-bold fs-5 brown-text">
            {classRoom?.name} {classRoom?.sections}
          </div>
          <div className="d-flex py-2">
            <div className="d-flex align-items-center fw-semibold fs-6">{classRoom?.schedule}</div>
            <div className="d-flex align-items-center ps-4 pe-2 fw-semibold fs-6">
              {classRoom?.class_code}
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
              Copy
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center me-5 ms-auto">
          <Search />
        </div>
      </div>
    );
    bodyContent = renderTeacherTeamManagement();
  }

  /// STUDENT section
  if (classMember.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT) {
    const {
      currentTeamMember,
      team,
      isRetrieving: isRoleRetrieving,
    } = useClassMemberTeam(classId, classMember?.id);

    useEffect(() => {
      if (team) {
        setSelectedTeamStatus(team.status);
        const mappedTeamMembers = team.members.map((member) => {
          const { id: tmId, first_name, last_name, role, status } = member;

          return {
            id: tmId,
            name: `${first_name} ${last_name}`,
            role: role === GLOBALS.TEAMMEMBER_ROLE.LEADER ? 'Leader' : 'Member',
            actions:
              currentTeamMember?.id === tmId ? (
                <button
                  type="button"
                  className="btn btn-sm fw-bold text-danger"
                  onClick={() => {
                    if (currentTeamMember?.role === GLOBALS.TEAMMEMBER_ROLE.LEADER) {
                      setCurrentLeaderId(currentTeamMember.id);
                      setCurrentTeamId(team.id);
                      setIsLeavingTeam(true);
                      setCurrentTeamMembers(team.members);
                    } else {
                      leaveTeam(team.id, currentTeamMember.id);
                      window.location.reload();
                    }
                  }}
                >
                  LEAVE
                </button>
              ) : currentTeamMember?.role === GLOBALS.TEAMMEMBER_ROLE.LEADER &&
                status === GLOBALS.MEMBER_STATUS.PENDING ? (
                <>
                  <button
                    type="button"
                    className="btn btn-sm fw-bold text-success"
                    onClick={() => {
                      acceptTeamMember(team.id, tmId);
                    }}
                  >
                    ACCEPT
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm fw-bold text-danger"
                    onClick={() => {
                      removeTeamMember(team.id, tmId);
                      window.location.reload();
                    }}
                  >
                    REJECT
                  </button>
                </>
              ) : currentTeamMember?.role === GLOBALS.TEAMMEMBER_ROLE.LEADER ? (
                <button
                  type="button"
                  className="btn btn-sm fw-bold text-danger"
                  onClick={() => {
                    removeTeamMember(team.id, tmId);
                    window.location.reload();
                  }}
                >
                  KICK
                </button>
              ) : (
                <button type="button" className="btn btn-sm fw-bold" disabled>
                  No Action
                </button>
              ),
          };
        });

        setMembersTableData(mappedTeamMembers);
      }
    }, [team]);

    useEffect(() => {
      if (!isRoleRetrieving) {
        if (
          currentTeamMember?.status === GLOBALS.MEMBER_STATUS.PENDING &&
          currentTeamMember?.role === GLOBALS.TEAMMEMBER_ROLE.LEADER
        ) {
          setShowNotif(true);
        } else {
          setShowNotif(false);
        }
      }
    }, [currentTeamMember]);

    if (team && currentTeamMember?.status === GLOBALS.MEMBER_STATUS.ACCEPTED) {
      subheaderContent = (
        <div className="subheader-body d-flex pt-2 pb-2">
          <div className="mx-5">
            <div className="fw-bold fs-5 brown-text">
              {classRoom?.name} {classRoom?.sections}
            </div>
            <div className="d-flex py-2">
              <div className="d-flex align-items-center fw-semibold fs-6">
                {classRoom?.schedule}
              </div>
              <div className="d-flex align-items-center ps-4 pe-2 fw-semibold fs-6">
                {classRoom?.class_code}
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
                Copy
              </button>
            </div>
          </div>

          {currentTeamMember?.status === GLOBALS.MEMBER_STATUS.ACCEPTED &&
            currentTeamMember?.role === GLOBALS.TEAMMEMBER_ROLE.LEADER && (
              <div className="d-flex align-items-center me-5 ms-auto">
                <div className="d-flex">
                  <div className="d-flex fw-semibold justify-content-center align-items-center me-2">
                    Hiring:
                  </div>
                  <select
                    className={`form-select form-select-sm ${getColorClass()} fw-bold`}
                    onChange={(e) => {
                      handleOnChangeTeamStatus(e, team.id);
                    }}
                    value={selectedTeamStatus}
                  >
                    <option className="text-success fw-semibold" value="1">
                      OPEN
                    </option>
                    <option className="text-danger fw-semibold" value="0">
                      CLOSE
                    </option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ms-2"
                    onClick={() => setUpdateTeamModalOpen(true)}
                  >
                    Edit
                  </button>
                </div>
                <UpdateTeam
                  visible={isUpdateTeamModalOpen}
                  handleModal={() => setUpdateTeamModalOpen(false)}
                  teamData={team}
                />
              </div>
            )}
        </div>
      );

      bodyContent = renderTeamData(team);
    } else {
      subheaderContent = (
        <div className="subheader-body d-flex pt-2 pb-2">
          <div className="mx-5">
            <div className="fw-bold fs-5 brown-text">
              {classRoom?.name} {classRoom?.sections}
            </div>
            <div className="d-flex py-2">
              <div className="d-flex align-items-center fw-semibold fs-6">
                {classRoom?.schedule}
              </div>
              <div className="ms-4 me-2 fw-semibold fs-6">{classRoom?.class_code}</div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
                Copy
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center me-5 ms-auto">
            <Search />
          </div>
        </div>
      );
      if (
        currentTeamMember?.role === GLOBALS.TEAMMEMBER_ROLE.LEADER &&
        currentTeamMember?.status === GLOBALS.MEMBER_STATUS.ACCEPTED
      ) {
        bodyContent = renderTeamLeaderNoTeam();
      } else {
        bodyContent = renderStudentNoTeam();
      }
    }
  }

  const renderAddLeaderModal = () => (
    <div>
      <div className="d-flex flex-column">
        <AddLeaders
          modalTitle="Add Leaders"
          visible={isAddLeadersModalOpen}
          handleModal={closeAddLeadersModal}
        />
      </div>
    </div>
  );

  const handleAcceptLeader = () => {
    acceptLeader(classMember?.id);
    window.location.reload();
  };

  const handleDeclineLeader = () => {
    removeLeader(classMember?.id);
    window.location.reload();
  };

  const renderPendingLeader = () => (
    <div className="notif-pending-bar fw-semibold">
      You have been Identified/Selected as a Team Leader. &nbsp;
      <button
        type="button"
        className="btn notif-pending-btn align-middle"
        onClick={handleAcceptLeader}
      >
        Accept
      </button>
      <button
        type="button"
        className="btn notif-pending-btn align-middle"
        onClick={handleDeclineLeader}
      >
        Decline
      </button>
    </div>
  );

  return (
    <div>
      {subheaderContent}
      {bodyContent}
      {showNotif && renderPendingLeader()}
      {isAddLeadersModalOpen && renderAddLeaderModal()}

      <AssignNewLeader
        visible={isLeavingTeam}
        handleModal={() => setIsLeavingTeam(false)}
        hasDropdown
        members={currentTeamMembers}
        teamId={currentTeamId}
        leaderId={currentLeaderId}
        leaveTeam={leaveTeam}
        setLeader={setLeader}
      />
    </div>
  );
}

export default Teams;
