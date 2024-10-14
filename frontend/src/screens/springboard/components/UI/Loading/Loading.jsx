import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Loading.module.css';

const Loading = (props) => {
  const { timeout, style } = props;
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (timeout && timeout !== 'auto') {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, timeout);

      return () => clearTimeout(timer);
    }

    // If timeout is 'auto' or not provided, keep loading indefinitely
    return () => {};
  }, [timeout]);

  return (
    <div className={styles.loading} style={style}>
      {showLoading && <CircularProgress />}
    </div>
  );
};

export default Loading;
