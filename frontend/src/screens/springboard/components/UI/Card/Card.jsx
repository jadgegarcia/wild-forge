import React from 'react';
import styles from './Card.module.css';

const Card = (props) => (
  <div className={`${styles.card} ${props.className}`} style={props.style} onClick={props.onClick}>
    {props.children}
  </div>
);

export default Card;
