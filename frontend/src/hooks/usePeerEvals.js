import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EvalsService } from '../services';

const usePeerEvals = () => {
  const navigate = useNavigate();
  const [peerEvals, setPeerEvals] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const getPeerEvals = async () => {
      let responseCode;
      let retrievedPeerEvals;

      try {
        const res = await EvalsService.all();
        responseCode = res?.status;
        retrievedPeerEvals = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setPeerEvals(retrievedPeerEvals);
          break;
        case 400:
        case 500:
          navigate('/peer-eval');
          break;
        default:
      }

      setIsProcessing(false);
    };

    getPeerEvals();
  }, []);

  const createPeerEval = async ({ name, forms_link, sheet_link, callbacks }) => {
    let responseCode;
    let retrievedPeerEval;

    try {
      const res = await EvalsService.create({
        name,
        forms_link,
        sheet_link,
      });

      responseCode = res?.status;
      retrievedPeerEval = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 201:
        await callbacks.created({ retrievedPeerEval });
        break;
      case 400:
        await callbacks.invalidFields();
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsProcessing(false);
  };

  const updatePeerEval = async (eval_id, { name, forms_link, sheet_link, callbacks }) => {
    let responseCode;
    let retrievedPeerEval;

    try {
      const res = await EvalsService.update(eval_id, {
        name,
        forms_link,
        sheet_link,
      });

      responseCode = res?.status;
      retrievedPeerEval = res?.data;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        await callbacks.updated({ retrievedPeerEval });
        break;
      case 400:
        await callbacks.invalidFields();
        break;
      case 500:
        await callbacks.internalError();
        break;
      default:
    }

    setIsProcessing(false);
  };

  const deletePeerEval = async (eval_id) => {
    let responseCode;

    try {
      const res = await EvalsService.delete(eval_id);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 204:
        break;
      default:
    }

    setIsProcessing(false);
  };

  const assignClassRoomEval = async (id, classRoom) => {
    let responseCode;

    try {
      const res = await EvalsService.assign(id, { class_id: classRoom.id });
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        setPeerEvals((prevPeerEvals) =>
          prevPeerEvals.map((peerEval) => {
            if (peerEval.id === id) {
              peerEval.assigned_classes.push(classRoom);
            }
            return peerEval;
          })
        );
        break;
      default:
    }

    setIsProcessing(false);
  };

  return {
    peerEvals,
    isProcessing,
    createPeerEval,
    updatePeerEval,
    deletePeerEval,
    assignClassRoomEval,
  };
};

export default usePeerEvals;
