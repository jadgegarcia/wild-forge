import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ClassRoomsService } from '../services';

const useTeams = (classId) => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(null);
  const [leaders, setLeaders] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [isRetrievingLeaders, setIsRetrievingLeaders] = useState(true);
  const [isSettingLeader, setIsSettingLeader] = useState(true);
  const [isCreatingTeam, setIsCreatingTeam] = useState(true);
  const [isUpdatingTeam, setIsUpdatingTeam] = useState(true);
  const [isJoiningTeam, setIsJoiningTeam] = useState(true);

  // leaders
  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedLeaders;

      try {
        const res = await ClassRoomsService.leaders(classId);

        responseCode = res?.status;
        retrievedLeaders = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setLeaders(retrievedLeaders);
          break;
        case 404:
          navigate(`/classes/${classId}/teams`);
          break;
        case 500:
          navigate('/classes');
          break;
        default:
      }
      setIsRetrievingLeaders(false);
    };

    get();
  }, []);

  const acceptLeader = async (memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.acceptLeader(classId, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const removeLeader = async (memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.removeLeader(classId, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const createTeam = async ({ name, description, callbacks }) => {
    setIsCreatingTeam(true);

    let responseCode;
    let retrievedTeam;

    try {
      const res = await ClassRoomsService.createTeam(classId, {
        name,
        description,
      });

      responseCode = res?.status;
      retrievedTeam = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 201:
        await callbacks.created({ retrievedTeam });
        break;
      case 400:
        await callbacks.invalidFields();
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsCreatingTeam(false);
  };

  const updateTeam = async (teamID, { name, description, callbacks }) => {
    setIsUpdatingTeam(true);

    let responseCode;
    let retrievedTeam;

    try {
      const res = await ClassRoomsService.updateTeam(classId, teamID, {
        name,
        description,
      });

      responseCode = res?.status;
      retrievedTeam = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        await callbacks.updated({ retrievedTeam });
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const deleteTeam = async (teamID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.deleteTeam(classId, teamID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        // setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamID));
        Swal.fire({
          title: 'Team Successfully Deleted',
          icon: 'success',
        }).then(() => {
          navigate(`/classes/${classId}/teams`);
        });
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const openTeams = async (teamID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.openTeams(classId, teamID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const closeTeams = async (teamID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.closeTeams(classId, teamID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const joinTeam = async (teamID) => {
    let responseCode;
    let responseMessage;

    try {
      const res = await ClassRoomsService.joinTeam(classId, teamID);
      responseCode = res?.status;
      responseMessage = res?.data?.detail;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 400:
        alert(responseMessage);
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
    setIsJoiningTeam(false);
  };

  const teamMembers = async (teamID) => {
    let responseCode;
    let retrievedMembers;

    try {
      const res = await ClassRoomsService.teamMembers(classId, teamID);
      responseCode = res?.status;
      retrievedMembers = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        return retrievedMembers;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const acceptTeamMember = async (teamID, memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.acceptTeamMember(classId, teamID, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }
    switch (responseCode) {
      case 200:
      case 201:
        window.location.reload();
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const removeTeamMember = async (teamID, memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.removeTeamMember(classId, teamID, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }
    switch (responseCode) {
      case 204:
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  const leaveTeam = async (teamID, memberID) => {
    let responseCode;

    try {
      const res = await ClassRoomsService.leaveTeam(classId, teamID, memberID);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }
    switch (responseCode) {
      case 204:
        break;
      case 404:
        navigate(`/classes/${classId}/teams`);
        break;
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  useEffect(() => {
    const get = async () => {
      let responseCode;
      let retrievedTeams;

      try {
        const res = await ClassRoomsService.teams(classId);

        responseCode = res?.status;
        retrievedTeams = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setTeams(retrievedTeams);
          break;
        case 404:
          navigate(`/classes/${classId}/teams`);
          break;
        case 500:
          navigate('/classes');
          break;
        default:
      }
      setIsRetrieving(false);
    };

    get();
  }, []);

  return {
    teams,
    leaders,
    isRetrieving,
    isRetrievingLeaders,
    isSettingLeader,
    isCreatingTeam,
    openTeams,
    closeTeams,
    joinTeam,
    teamMembers,
    acceptLeader,
    removeLeader,
    createTeam,
    updateTeam,
    deleteTeam,
    acceptTeamMember,
    removeTeamMember,
    leaveTeam,
  };
};

export default useTeams;
