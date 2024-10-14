import React, { useEffect, useState } from 'react';

import { useOutletContext } from 'react-router-dom';

import { Dialog } from 'primereact/dialog';

import { useAssignedPeerEval } from '../../../hooks';

import Table from '../../../components/table';

import { copyToClipBoard } from '../../../utils/copyToClipBoard';
import GLOBALS from '../../../app_globals';


import './index.scss';

function StudentPeerEval() {
  const { classId, classRoom, classMember } = useOutletContext();

  const { assignedPeerEvals, isProcessing, submit } = useAssignedPeerEval(classId, classMember?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [peerEvalTableData, setPeerEvalTableData] = useState([]);

  const [isViewingForm, setIsViewingForm] = useState(false);
  const [formsLink, setFormsLink] = useState('');
  const [classPeId, setClassPeId] = useState(null);
  const [pageCounter, setPageCounter] = useState(0);

  const handleOpenViewForm = () => {
    setIsViewingForm(true);
  };

  const handleCloseViewForm = () => {
    setIsViewingForm(false);
    setFormsLink('');
    setPageCounter(0);
  };

  const handleOnChangePage = (event) => {
    if (pageCounter === 1) {
      /// do something here
      submit(classPeId);
      setClassPeId(null);
      setPageCounter(0);
      window.location.reload();
    } else {
      setPageCounter(pageCounter + 1);
    }
  };

  useEffect(() => {
    if (assignedPeerEvals.length > 0) {
      const data = assignedPeerEvals.map((assignedPeerEval) => {
        const { class_pe_id, name, forms_link, status } = assignedPeerEval;
        return {
          id: class_pe_id,
          name,
          actions: (
            <button
              type="button"
              className="btn btn-sm fw-bold text-success"
              onClick={() => {
                setClassPeId(class_pe_id);
                setFormsLink(forms_link);
                handleOpenViewForm();
              }}
              disabled={status === GLOBALS.PE_TAKER_STATUS.COMPLETED}
            >
              {status === GLOBALS.PE_TAKER_STATUS.COMPLETED ? 'COMPLETED' : 'VIEW'}
            </button>
          ),
        };
      });
      setPeerEvalTableData(data);
      setFilteredData(data);
    }
  }, [assignedPeerEvals]);

  const handleCopyCode = () => {
    try {
      copyToClipBoard(classRoom?.class_code);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="d-flex">
        <div className="d-flex pt-2 pb-2">
          <div className="px-5">
            <div className="d-flex align-items-center fw-bold fs-5 brown-text">
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
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center pt-3 pb-3 px-5">
        {peerEvalTableData && filteredData.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="brown-text fw-bold fs-5 py-2 mx-5">No peer evals found</div>
          </div>
        ) : (
          <Table headers={['name', 'actions']} data={peerEvalTableData} className="mt-3" />
        )}
      </div>
      {isViewingForm && (
        <Dialog
          className="view-team-peer-eval-modal"
          visible={isViewingForm}
          onHide={handleCloseViewForm}
          showHeader={false}
        >
          <div className="d-flex flex-column p-5">
            <button
              aria-label="Close Modal"
              className="btn btn-close ms-auto join-class-close"
              onClick={handleCloseViewForm}
            />
            <iframe title="Peer Eval Form" src={formsLink} onLoad={handleOnChangePage}>
              Loading…
            </iframe>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default StudentPeerEval;
