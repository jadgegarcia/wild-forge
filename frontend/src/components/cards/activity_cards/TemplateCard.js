const TemplateCard = ({ templateData, onClick }) => (
  <div
    className="p-3 shadow border border-black rounded-3 d-flex align-items-center"
    onClick={onClick}
  >
    <div className="d-flex flex-row gap-3 align-items-center">
      <div className=" bg-dark p-1 rounded-4 " />
      <h6 className="fw-bold  m-0">{templateData.title}</h6>
    </div>
  </div>
);

export default TemplateCard;
