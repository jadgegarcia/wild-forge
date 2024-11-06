import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityCommentService } from '../services';

const useActivityComments = (id) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);

  // use for getting all comments
  useEffect(() => {
    if (!id) {
      return;
    }
    const get = async () => {
      let responseCode;
      let retrievedComments;
      try {
        const res = await ActivityCommentService.getAllCommentsForActivity(id);

        responseCode = res?.status;
        retrievedComments = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setComments(retrievedComments);
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

  const addComment = async (comment) => {
    let responseCode;

    try {
      const res = await ActivityCommentService.addComment(comment);
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

  const deleteComment = async (commentId) => {
    let responseCode;

    try {
      const res = await ActivityCommentService.deleteComment(commentId);
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

  return { isLoading, comments, addComment, deleteComment };
};

export default useActivityComments;
