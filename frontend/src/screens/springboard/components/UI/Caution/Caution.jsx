import React from 'react';
import styles from './Caution.module.css';

function Caution() {
  return (
    <div className={styles.sa}>
      <div className={styles['sa-warning']}>
        <div className={styles['sa-warning-body']} />
        <div className={styles['sa-warning-dot']} />
      </div>
    </div>
  );
}

export default Caution;
