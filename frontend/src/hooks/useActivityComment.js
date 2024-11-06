import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityCommentService } from '../services';

const useActivityComment = (id) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState([]);

  // use for getting all comments
  useEffect(() => {
    if (!id) {
      return;
    }
    const get = async () => {
      let responseCode;
      let retrievedComments;
      try {
        const res = await ActivityCommentService.getComment(id);

        responseCode = res?.status;
        retrievedComments = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setComment(retrievedComments);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }

      setIsLoading(false);
    };

    get();
  }, [id]);

  const updateComment = async (commentData) => {
    let responseCode;

    try {
      const res = await ActivityCommentService.updateComment(id, commentData);
      responseCode = res?.status;
    } catch (error) {
      responseCode = error?.response?.status;
    }

    switch (responseCode) {
      case 200:
        break;
      case 404:
      case 500:
        navigate('/classes');
        break;
      default:
    }
  };

  return { isLoading, comment, updateComment };
};

export default useActivityComment;
