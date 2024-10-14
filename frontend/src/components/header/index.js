import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="d-flex flex-row">
      <div className="d-flex header">
        <div className="app-name-header">
          <div className="yellow-text fs-3 fw-bold">Wild</div>
          <div className="fs-3 fw-bolder">FORGE</div>
        </div>
        <div className="d-flex p-5 ms-auto">
          <Link to="/logout" className="text-decoration-none">
            <div className="red-text fw-bold fs-6 px-3">Logout</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
