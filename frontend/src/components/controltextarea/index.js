import { InputTextarea } from 'primereact/inputtextarea';
import PropTypes from 'prop-types';

import './index.scss';

function ControlTextArea({ name, label, type, value, onChange, error, disabled, ...rest }) {
  return (
    <div className="d-flex flex-column">
      <label className="fs-5 fw-bold pt-2 pb-2" htmlFor={name}>
        {label}
      </label>
      <InputTextarea
        id={name}
        style={{ height: '15rem' }}
        cols={30}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

ControlTextArea.defaultProps = {
  type: 'text',
  disabled: false,
};

ControlTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ControlTextArea;
