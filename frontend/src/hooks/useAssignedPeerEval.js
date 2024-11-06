import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EvalsService } from '../services';

const useAssignedPeerEval = (class_id, classmember_id) => {
  const navigate = useNavigate();
  const [assignedPeerEvals, setAssignedPeerEvals] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const getAssignedPeerEvals = async () => {
      let responseCode;
      let retrievedAssignedPeerEvals;

      try {
        const res = await EvalsService.assigned(class_id, classmember_id);
        responseCode = res?.status;
        retrievedAssignedPeerEvals = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setAssignedPeerEvals(retrievedAssignedPeerEvals);
          break;
        case 400:
        case 500:
          break;
        default:
      }

      setIsProcessing(false);
    };

    getAssignedPeerEvals();
  }, []);

  const submit = async (class_pe_id) => {
    let responseCode;

    try {
      const res = await EvalsService.submit_eval(class_pe_id, classmember_id);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 201:
        break;
      default:
    }
  };

  return { assignedPeerEvals, isProcessing, submit };
};

export default useAssignedPeerEval;
