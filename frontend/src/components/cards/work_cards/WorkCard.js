const WorkCard = ({ isClickable, onEditClick, workData, isSelected }) => {
  const { id, description, file_attachment, date_created } = workData;

  // If file_attachment is available, extract the file name
  const fileName = file_attachment ? file_attachment.split('/').pop() : 'No file attached';

  // If file_attachment is available, create a download link; otherwise, disable the link
  const downloadLink = file_attachment ? (
    <a href={file_attachment} download={fileName}>
      {fileName}
    </a>
  ) : (
    <span>{fileName}</span>
  );

  const handleClick = () => {
    // Only execute the onEditClick handler if isClickable is true
    if (isClickable) {
      onEditClick && onEditClick();
    }
  };

  return (
    <div
      className={`card border ${
        isSelected ? 'border-primary bg-secondary text-white' : 'border-primary'
      } p-3 shadow-sm ${isClickable ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="card-body">
        <h5 className="card-title">{description}</h5>
        <p className="card-text">Date Added: {new Date(date_created).toLocaleString()}</p>
        <p className="card-text bold">File Attachment: {downloadLink}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default WorkCard;
