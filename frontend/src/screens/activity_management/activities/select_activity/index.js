import { useOutletContext } from 'react-router-dom';
import { ViewActivityStudent } from './view_student';
import { ViewActivityTeacher } from './view_teacher';

function ViewActivity() {
  const { user } = useOutletContext();

  if (user?.role === 1) return <ViewActivityTeacher />;
  if (user?.role === 2) return <ViewActivityStudent />;
}

export default ViewActivity;
