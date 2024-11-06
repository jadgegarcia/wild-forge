import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetingsService } from '../services';

const useMeetingHistory = (meetingId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const getRatings = async () => {
      let responseCode;
      let retrievedRatings;

      try {
        const res = await MeetingsService.getMeetingRatingHistory(meetingId);

        responseCode = res?.status;
        retrievedRatings = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setRatings(retrievedRatings);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }
    };

    const getRemarks = async () => {
      let responseCode;
      let retrievedRemarks;

      try {
        const res = await MeetingsService.getMeetingRemarkHistory(meetingId);

        responseCode = res?.status;
        retrievedRemarks = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setRemarks(retrievedRemarks);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }
    };

    const getFeedbacks = async () => {
      let responseCode;
      let retrievedFeedbacks;

      try {
        const res = await MeetingsService.getMeetingFeedbackHistory(meetingId);

        responseCode = res?.status;
        retrievedFeedbacks = res?.data;
      } catch (error) {
        responseCode = error?.response?.status;
      }

      switch (responseCode) {
        case 200:
          setFeedbacks(retrievedFeedbacks);
          break;
        case 404:
        case 500:
          navigate('/classes');
          break;
        default:
      }
    };

    getRatings();
    getRemarks();
    getFeedbacks();
    setIsLoading(false);
  }, []);

  return { isLoading, ratings, remarks, feedbacks };
};

export default useMeetingHistory;
