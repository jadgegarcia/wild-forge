import { InputText } from 'primereact/inputtext';
import PropTypes from 'prop-types';

import './index.scss';

function ControlInput({ name, label, type, value, onChange, error, disabled, ...rest }) {
  return (
    <div className="d-flex flex-column">
      <label className="fs-5 fw-bold pt-2 pb-2" htmlFor={name}>
        {label}
      </label>
      <InputText
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

ControlInput.defaultProps = {
  type: 'text',
  disabled: false,
};

ControlInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.any,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ControlInput;
