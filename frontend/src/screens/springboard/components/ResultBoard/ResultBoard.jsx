import React, { useState, useEffect } from 'react';
import Card from '../UI/Card/Card';
import CircularProgressWithLabel from '../UI/ProgressBar/CircularProgressWithLabel';
import styles from './ResultBoard.module.css';
import { useProjects } from '../../../../hooks';

const ResultBoard = ({ boardid, feedback }) => {
  const [board, setBoard] = useState(null);
  const { getProjectBoardById } = useProjects();
  const [feedbackData, setFeedbackData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectBoardById(boardid);
        setBoard(response.data);
        const parsedData = JSON.parse(response.data.criteria_feedback);
        setFeedbackData(parsedData); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [boardid]);

  useEffect(() => {
    // Parse the JSON string into an array of objects
    try {
      const feedbackJson = `{
        "completeness": {
          "score": 8,
          "description": "Completeness is above average with only minor adjustments needed."
        },
        "relevance": {
          "score": 8,
          "description": "Relevance is above average with only minor adjustments needed."
        },
        "clarity": {
          "score": 8,
          "description": "Clarity is above average with only minor adjustments needed."
        },
        "organization": {
          "score": 8,
          "description": "Organization is above average with only minor adjustments needed."
        },
        "grammar": {
          "score": 2,
          "description": "Grammar needs significant improvement."
        }
      }`;
      
      
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, []);

  if (!board) {
    return <p>Loading ...</p>;
  }

  const recommendationLines = board.recommendation.split('\n');
  const feedbackLines = board.feedback.split('\n');

  return (
    <div className={styles.container}>
      <span className={styles.title}>Results {/*feedback*/}</span>
      {/* <button
        onClick={() => {
          console.log(feedbackData)
                }}
      >
        Print Boards
      </button> */}
      <h3>Feedback Details:</h3>

      <div className={styles.resultContainer}>
        <div className={styles.criteria}>
          {Object.keys(feedbackData).map((key) => (
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
          ))}
          <Card className={styles.cardCriteria}>
            <h3 className={styles.ratings}>
              <strong>Total:</strong>
              <br />
              Average Score of all Criteria
            </h3>
            <div className={styles.cardContent} style={{ gap: '10px' }}>
              <CircularProgressWithLabel value={board.score * 10} size={80} />
            </div>
          </Card>
        </div>

        <div className={styles.adviceDiv} style={{ marginTop: '60px' }}>
          <div className={styles.advice}>
            <h4>Feedback</h4>
            <div className={styles.content}>
              {feedbackLines.map((line, index) => (
                <p key={index} style={{ margin: 0, padding: 0 }}>
                  {line}
                  {index % 2 === 0 ? <br /> : null}
                </p>
              ))}
            </div>
          </div>
          <div className={styles.advice}>
            <h4>Recommendations</h4>
            <div className={styles.content}>
              {recommendationLines.map((line, index) => (
                <p key={index} style={{ margin: 0, padding: 0 }}>
                  {line}
                  {index % 2 === 0 ? <br /> : null}
                </p>  
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ResultBoard;
