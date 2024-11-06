const ActivityCard = ({ onClick, ...props }) => (
  <button
    className="btn btn-outline-dark p-3 rounded-3 d-flex align-items-center justify-content-between"
    onClick={onClick}
  >
    <h6 className="fw-bold  m-0">{props.title}</h6>
    {props.submission_status ? (
      <div className=" bg-success p-1 rounded-4 "> </div>
    ) : (
      <div className=" bg-danger p-1 rounded-4 "> </div>
    )}
  </button>
);

export default ActivityCard;
