import React from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

function DischargeNotif() {
  return (
    <div className="notif-bar text-center">
      Your team leader has decided to discharge you from the team. Please respond accordingly.
      <Link to="{}" className="text-white mx-3">
        View
      </Link>
    </div>
  );
}

export default DischargeNotif;
