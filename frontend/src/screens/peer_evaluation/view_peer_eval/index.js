import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Dialog } from 'primereact/dialog';

import jwtDecode from 'jwt-decode';
import { useAuth } from '../../../contexts/AuthContext';

import { useClassRooms, usePeerEvals } from '../../../hooks';

import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/header';
import Search from '../../../components/search';
import Table from '../../../components/table';
import CreatePeerEval from '../../../components/modals/create_peereval';
import UpdatePeerEvalForm from '../../../components/modals/update_peereval';

import GLOBALS from '../../../app_globals';

import './index.scss';

function PeerEval() {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  const { peerEvals, deletePeerEval, assignClassRoomEval } = usePeerEvals();

  const { classes } = useClassRooms();

  const [peerCreateEvalModal, setCreatePeerEvalModal] = useState(false);
  const [peerUpdateEvalModal, setUpdatePeerEvalModal] = useState(false);
  const [assignClassModal, setAssignClassModal] = useState(false);

  const [peerEvalsTableData, setPeerEvalsTableData] = useState([]);
  const [classRoomsTabledata, setClassRoomsTableData] = useState([]);

  const [selectedPeerEval, setSelectedPeerEval] = useState({});

  const [searchPEQuery, setSearchPEQuery] = useState('');
  const [filteredPeerEvals, setFilteredPeerEvals] = useState([]);

  const [searchClassQuery, setSearchClassQuery] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);

  let buttons;
  if (user?.role === GLOBALS.USER_ROLE.MODERATOR) {
    buttons = GLOBALS.SIDENAV_MODERATOR;
  } else {
    buttons = GLOBALS.SIDENAV_DEFAULT;
  }

  const peerEvalHeaders = ['id', 'name', 'actions'];
  const classesHeaders = ['id', 'name', 'actions'];

  const handlCreatePeerEvalModal = () => {
    setCreatePeerEvalModal(true);
  };

  const handleCloseCreatePeerEvalModal = () => {
    setCreatePeerEvalModal(false);
  };

  const openAssignTeamModal = () => {
    setAssignClassModal(true);
  };

  const closeAssignTeamModal = () => {
    setAssignClassModal(false);
  };

  const handleUpdatePeerEvalModal = () => {
    setUpdatePeerEvalModal(true);
  };

  const handleCloseUpdatePeerEvalModal = () => {
    setUpdatePeerEvalModal(false);
  };

  const handleSearchPEChange = (e) => {
    setSearchPEQuery(e.target.value);
  };

  const handleSearchClassChange = (e) => {
    setSearchClassQuery(e.target.value);
  };

  const searchClasses = (query) => {
    const lowerCaseQuery = query?.toLowerCase();
    if (lowerCaseQuery.length === 0) {
      setFilteredClasses(classRoomsTabledata);
    } else {
      const filtered = classRoomsTabledata?.filter(
        (classRoom) => classRoom && classRoom.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredClasses(filtered);
    }
  };

  const searchPeerEvals = (query) => {
    const lowerCaseQuery = query?.toLowerCase();
    if (lowerCaseQuery.length === 0) {
      setFilteredPeerEvals(peerEvalsTableData);
    } else {
      const filtered = peerEvalsTableData?.filter(
        (peerEval) => peerEval && peerEval.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredPeerEvals(filtered);
    }
  };

  useEffect(() => {
    searchPeerEvals(searchPEQuery);
    searchClasses(searchClassQuery);
  }, [searchPEQuery, peerEvalsTableData, searchClassQuery, classRoomsTabledata]);

  const actionButtons = (data) => (
    <div>
      <a
        type="button"
        href={data.sheet_link}
        target="_blank"
        className="btn btn-sm fw-bold text-success"
        rel="noreferrer"
      >
        VIEW
      </a>

      <button
        type="button"
        className="btn btn-sm fw-bold text-info"
        onClick={() => {
          setSelectedPeerEval(data);
          openAssignTeamModal();
        }}
      >
        ASSIGN
      </button>

      <button
        type="button"
        className="btn btn-sm fw-bold text-warning"
        onClick={() => {
          setSelectedPeerEval(data);
          handleUpdatePeerEvalModal();
        }}
      >
        EDIT
      </button>

      <button
        type="button"
        className="btn btn-sm fw-bold text-danger"
        onClick={() => {
          deletePeerEval(data.id);
        }}
      >
        DELETE
      </button>
    </div>
  );

  useEffect(() => {
    if (peerEvals.length > 0) {
      const peerEvalsData = peerEvals?.map((peerEval) => {
        const { id, name } = peerEval;
        return {
          id,
          name,
          actions: actionButtons(peerEval),
        };
      });

      setPeerEvalsTableData(peerEvalsData);
    }
  }, [peerEvals]);

  useEffect(() => {
    if (classes.length > 0) {
      const assigned_classes = selectedPeerEval?.assigned_classes;

      // map classes and set the button as Assigned if the class is already assigned
      const classRoomsData = classes?.map((classRoom) => {
        const { id, course_name } = classRoom;
        const isAssigned = assigned_classes?.find((assignedClass) => assignedClass.id === id);

        if (isAssigned) {
          return {
            id,
            name: course_name,
            actions: (
              <button type="button" className="btn btn-sm btn-outline-success fw-semibold" disabled>
                Assigned
              </button>
            ),
          };
        }

        return {
          id,
          name: course_name,
          actions: (
            <button
              type="button"
              className="btn btn-sm btn-yellow-primary fw-semibold"
              onClick={() => {
                assignClassRoomEval(selectedPeerEval.id, classRoom);
              }}
            >
              Assign
            </button>
          ),
        };
      });

      setClassRoomsTableData(classRoomsData);
    }
  }, [classes, peerEvals, selectedPeerEval]);

  const renderAssignTeamModal = () => (
    <Dialog
      className="assign-teams-modal"
      visible={assignClassModal}
      onHide={closeAssignTeamModal}
      showHeader={false}
    >
      <div className="d-flex flex-column p-5">
        <div className="d-grid gap-3">
          <div className="text-left fs-5 fw-semibold">List of Classes</div>
          <div className="ms-auto">
            <Search value={searchClassQuery} onChange={handleSearchClassChange} />
          </div>
          <Table headers={classesHeaders} data={filteredClasses} className="mt-3" />
          <div className="position-fixed bottom-0 start-50 translate-middle-x pb-5">
            <button
              type="btn"
              className="btn btn-outline-secondary btn-lg fw-semibold me-4"
              onClick={closeAssignTeamModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );

  // Create Peer Eval
  const renderPeerEvalModal = () => (
    <CreatePeerEval visible={peerCreateEvalModal} handleModal={handleCloseCreatePeerEvalModal} />
  );

  const renderUpdatePeerEvalModal = () => (
    <UpdatePeerEvalForm
      initValues={selectedPeerEval}
      visible={peerUpdateEvalModal}
      handleModal={handleCloseUpdatePeerEvalModal}
    />
  );

  return (
    <div className="d-flex">
      <Sidebar name={`${user?.first_name} ${user?.last_name}`} sidebarItems={buttons} />
      <div className="container-fluid d-flex flex-column">
        <Header />
        <div className="d-flex pt-2 pb-2">
          <div className="py-2 mx-5">
            <Search value={searchPEQuery} onChange={handleSearchPEChange} />
          </div>
          <div className="d-flex align-items-center ms-auto mx-5">
            <button
              type="btn"
              className="btn btn-yellow-primary fw-semibold"
              onClick={handlCreatePeerEvalModal}
            >
              Add Peer Evaluation
            </button>
          </div>
        </div>
        <div className="d-flex flex-column">
          <div className="brown-text fw-bold fs-5 py-2 px-5">PEER EVALUATION</div>
          <div className="px-5">
            <Table headers={peerEvalHeaders} data={filteredPeerEvals} className="mt-3" />
          </div>
          {peerEvalsTableData && filteredPeerEvals.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="brown-text fw-bold fs-5 py-2 mx-5">No peer evaluations found</div>
            </div>
          ) : null}
          {peerCreateEvalModal && renderPeerEvalModal()}
          {peerUpdateEvalModal && renderUpdatePeerEvalModal()}
          {assignClassModal && renderAssignTeamModal()}
        </div>
      </div>
    </div>
  );
}

export default PeerEval;
