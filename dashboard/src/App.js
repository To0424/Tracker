import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
// You can also import CartMovement if you want to include it
import CartMovement from './components/CartMovement';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/data/')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  }, []);

  return (
    <div>
      <h1>Data Points</h1>
      {/* <DataTable data={data} /> */}
      {/* You can include CartMovement component here if needed */}
      <CartMovement />
    </div>
  );
};

export default App;