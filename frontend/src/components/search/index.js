import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

function Search({ value, onChange }) {
  return <input className="search-input" placeholder="Search" value={value} onChange={onChange} />;
}

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Search;
