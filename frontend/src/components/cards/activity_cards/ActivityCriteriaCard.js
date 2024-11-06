const ActivityCriteriaCard = ({ onClick, ...props }) => (
    <button
      className="btn btn-outline-dark p-3 rounded-3 d-flex align-items-center justify-content-between"
      onClick={onClick}
    >
      <h6 className="fw-bold m-0">{props.name}</h6>
      {/* <p className="m-0">{props.description}</p> */}
    </button>
  );
  
  export default ActivityCriteriaCard;
  