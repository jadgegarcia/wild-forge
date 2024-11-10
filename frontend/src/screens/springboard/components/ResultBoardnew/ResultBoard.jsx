import React, { useState, useEffect } from 'react';
import Card from '../UI/Card/Card';
import CircularProgressWithLabel from '../UI/ProgressBar/CircularProgressWithLabel';
import styles from './ResultBoard.module.css';

const ResultBoard = ({ feedback }) => {
  const [feedbackData, setFeedbackData] = useState({});

  // Function to log the feedback data
  const logFeedbackData = () => {
    console.log('Feedback Data:', feedbackData);
  };

  // Function to calculate the average score from the feedback data
  const calculateAverageScore = () => {
    const totalScore = Object.values(feedbackData).reduce((acc, curr) => acc + curr.score, 0);
    const criteriaCount = Object.keys(feedbackData).length;
    return criteriaCount > 0 ? (totalScore / criteriaCount).toFixed(1) : 0;
  };

  const averageScore = calculateAverageScore();

  useEffect(() => {
    // Parse the JSON string into an object and update the state
    try {
      const parsedData = JSON.parse(feedback);
      setFeedbackData(parsedData); 
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, [feedback]); // Ensure the effect runs when feedback prop changes

  return (
    <div className={styles.container}>
      <span className={styles.title}>Results</span>
      {/* <button onClick={logFeedbackData} className={styles.logButton}>
        Log Feedback Data
      </button> */}
      <h3>Feedback Details:</h3>
      <div className={styles.resultContainer}>
        <div className={styles.criteria}>
          
          {Object.keys(feedbackData).length > 0 ? (
            Object.keys(feedbackData).map((key) => (
              <div key={key} className={styles.cardWrapper}>
                <Card className={styles.cardCriteria}>
                  <h5 className={styles.ratings}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                    <br />
                    {feedbackData[key].description}
                  </h5>
                  <div className={styles.cardContent} style={{ gap: '10px' }}>
                    <CircularProgressWithLabel value={feedbackData[key].score * 10} size={80} />
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <p>No feedback available: You have not yet completed this Activity</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResultBoard;
