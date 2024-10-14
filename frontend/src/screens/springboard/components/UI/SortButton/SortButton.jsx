import React from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import styles from './SortButton.module.css';

function SortButton(props) {
  return (
    <div className={styles.sortButtonContainer}>
      <div
        className={`${styles.button} ${props.isActive && props.sort ? styles.activeButton : ''}`}
      >
        <TiArrowSortedUp />
      </div>
      <div
        className={`${styles.button} ${props.isActive && !props.sort ? styles.activeButton : ''}`}
      >
        <TiArrowSortedDown />
      </div>
    </div>
  );
}

export default SortButton;
