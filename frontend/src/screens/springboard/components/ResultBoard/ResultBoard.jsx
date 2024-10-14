import React, { useState, useEffect } from 'react';
import Card from '../UI/Card/Card';
import CircularProgressWithLabel from '../UI/ProgressBar/CircularProgressWithLabel';
import styles from './ResultBoard.module.css';
import { useProjects } from '../../../../hooks';

const ResultBoard = ({ boardid }) => {
  const [board, setBoard] = useState(null);
  const { getProjectBoardById } = useProjects();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectBoardById(boardid);
        setBoard(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [boardid]);

  if (!board) {
    return <p>Loading ...</p>;
  }

  const recommendationLines = board.recommendation.split('\n');
  const feedbackLines = board.feedback.split('\n');

  return (
    <div className={styles.container}>
      <span className={styles.title}>Results</span>

      <div className={styles.resultContainer}>
        <div className={styles.criteria}>
          <Card className={styles.cardCriteria}>
            <h5 className={styles.ratings}>Novelty</h5>
            <div className={styles.cardContent} style={{ gap: '10px' }}>
              <CircularProgressWithLabel value={board.novelty * 10} size={80} />
            </div>
          </Card>

          <Card className={styles.cardCriteria}>
            <h5 className={styles.ratings}>Capability</h5>
            <div className={styles.cardContent}>
              <CircularProgressWithLabel value={board.capability * 10} size={80} />
            </div>
          </Card>

          <Card className={styles.cardCriteria}>
            <h5 className={styles.ratings}>Technical Feasibility</h5>
            <div className={styles.cardContent}>
              <CircularProgressWithLabel value={board.technical_feasibility * 10} size={80} />
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
