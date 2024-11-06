import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import ResultBoard from '../../components/ResultBoard/ResultBoard';
import Button from '../../components/UI/Button/Button';
import styles from './EditBoard.module.css';

function EditBoardResult() {
  const navigate = useNavigate();
  const { id, boardid } = useParams();

  const goBack = () => {
    navigate(`/project/${id}/board/${boardid}`);
  };

  return (
    <div className={styles.body}>
      <Header />
      <ResultBoard boardid={boardid} />
      <Button className={styles.goBackButton} style={{ fontSize: '13px' }} onClick={goBack}>
        Back
      </Button>
    </div>
  );
}

export default EditBoardResult;
