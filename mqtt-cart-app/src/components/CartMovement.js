import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

// Define some colors for the tags
const colors = ['blue', 'red', 'green', 'orange', 'purple', 'brown'];

const CartMovement = ({ data }) => {
  const [chartData, setChartData] = useState({
    datasets: []
  });

  useEffect(() => {
    const datasets = Object.keys(data).map((tag, index) => ({
      label: `Tag: ${tag}`,
      data: [{ x: data[tag].x_axis, y: data[tag].y_axis }],
      backgroundColor: colors[index % colors.length],
    }));
    console.log('Datasets for the chart:', datasets);

    setChartData({ datasets });
  }, [data]);

  return (
    <div>
      <h1>Cart Movement</h1>
      <Scatter
        data={chartData}
        options={{
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              min: 0,
              max: 1500,
              ticks: { display: true },
              grid: { drawBorder: true, display: true },
            },
            y: {
              type: 'linear',
              position: 'left',
              min: 0,
              max: 1500,
              ticks: { display: true, beginAtZero: true },
              grid: { drawBorder: true, display: true },
            },
          },
          elements: {
            point: { radius: 5 }
          },
          animation: false
        }}
      />
      <div>
        <h2>Current Coordinates</h2>
        {Object.keys(data).map((tag) => (
          <p key={tag}>
            Tag {tag}: (x: {data[tag].x_axis}, y: {data[tag].y_axis})
          </p>
        ))}
      </div>
    </div>
  );
};

export default CartMovement;