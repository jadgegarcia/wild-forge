import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

function Table({ headers, data }) {
  const filteredHeaders = headers.filter((header) => header !== 'id');

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          {filteredHeaders.map((header) => (
            <th scope="col" key={header} className={header === 'actions' ? 'text-center' : ''}>
              {header.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {data.map((row) => (
          <tr key={row.id}>
            {filteredHeaders.map((header) => (
              <td
                key={header}
                className={`${header === 'actions' ? 'text-center' : ''} ${
                  header === 'status'
                    ? row[header].toLowerCase() === 'accepted'
                      ? 'accepted'
                      : 'pending'
                    : ''
                }`}
              >
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
