import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import ResultBoard from '../../components/ResultBoard/ResultBoard';
import Button from '../../components/UI/Button/Button';
import styles from './Result.module.css';

const Result = () => {
  const { boardid } = useParams();
  const navigate = useNavigate();

  const onClickDashboard = () => {
    const storedPath = sessionStorage.getItem('goToClass');
    navigate(storedPath);
  };

  return (
    <div className={styles.body}>
      <Header />
      <ResultBoard boardid={boardid} />
      <Button className={styles.button} onClick={onClickDashboard}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default Result;
