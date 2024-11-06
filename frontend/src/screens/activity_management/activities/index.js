import { useOutletContext } from 'react-router-dom';
import { Teacher } from './teacher';
import { Student } from './student';
import './index.scss';

function ActivityManagement() {
  const { user } = useOutletContext();

  if (user?.role === 1) return <Teacher />;
  if (user?.role === 2) return <Student />;
}

export default ActivityManagement;
