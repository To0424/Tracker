import React from 'react';

const DataTable = ({ data }) => {
  const datadetails = data.map((point, index) => (
    <tr key={index}>
      <td>{point.x_axis}</td>
      <td>{point.y_axis}</td>
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>
          <th>X-Axis</th>
          <th>Y-Axis</th>
        </tr>
      </thead>
      <tbody>
        {datadetails}
      </tbody>
    </table>
  );
};

export default DataTable;