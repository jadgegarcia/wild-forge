import React from 'react';
import ReactLoading from 'react-loading';

import './index.scss';

function Loading() {
  return (
    // whole page and loading screen at center
    <div className="d-flex flex-column align-items-center justify-content-center loading">
      {/* loading icon */}
      <ReactLoading type="bubbles" color="#000000" height={100} width={50} className="mb-3" />
    </div>
  );
}

export default Loading;
