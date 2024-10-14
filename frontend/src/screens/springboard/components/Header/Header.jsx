import React from 'react';
import { useOutletContext } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useAuth } from '../../../../contexts/AuthContext';
import prof from '../images/iconprof2.png';
import styles from './Header.module.css';

const Header = () => {
  const { accessToken } = useAuth();
  const user = jwtDecode(accessToken);

  return (
    <div className={`${styles.header}`} style={{ backgroundColor: '#9c7b16' }}>
      <div className={styles.right}>
        <div className={`${styles.img}`} style={{ marginRight: '10px' }}>
          <img src={prof} alt="profwhite" />
        </div>
        <p
          className={styles.text}
          style={{ color: 'white' }}
        >{`${user.first_name} ${user.last_name}`}</p>
      </div>
    </div>
  );
};

export default Header;
