import React, { useState, useEffect, useRef } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';
import Slider from '@mui/material/Slider';

ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

const CartMovement = ({ data }) => {
  const lastIndex = data.length - 1;
  const [currentIndex, setCurrentIndex] = useState(lastIndex);
  const [latestData, setLatestData] = useState({
    datasets: [{
      data: [{ x: data[lastIndex]?.x_axis, y: data[lastIndex]?.y_axis }],
      backgroundColor: 'blue',
    }]
  });
  const autoPullTimeout = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const lastIndex = data.length - 1;
      if (currentIndex === lastIndex) {
        setLatestData({
          datasets: [{
            label: 'Cart Position',
            data: [{ x: data[lastIndex].x_axis, y: data[lastIndex].y_axis }],
            backgroundColor: 'blue',
          }]
        });
      }
    }
  }, [data, currentIndex]);

  const handleSliderChange = (event, newValue) => {
    setCurrentIndex(newValue);
    const selectedPoint = data[newValue];
    setLatestData({
      datasets: [{
        label: 'Cart Position',
        data: [{ x: selectedPoint.x_axis, y: selectedPoint.y_axis }],
        backgroundColor: 'blue',
      }]
    });

    // Clear any existing timeout
    if (autoPullTimeout.current) {
      clearTimeout(autoPullTimeout.current);
    }

    // Start auto-pull from the selected point to the latest point
    autoPullTimeout.current = setTimeout(() => {
      autoPullToLatest(newValue);
    }, 1000); // Adjust the delay as needed
  };

  const autoPullToLatest = (startIndex) => {
    const lastIndex = data.length - 1;

    const iterateToLatest = (index) => {
      if (index <= lastIndex) {
        setCurrentIndex(index);
        setLatestData({
          datasets: [{
            label: 'Cart Position',
            data: [{ x: data[index].x_axis, y: data[index].y_axis }],
            backgroundColor: 'blue',
          }]
        });
        autoPullTimeout.current = setTimeout(() => {
          iterateToLatest(index + 1);
        }, 500); // Adjust the delay as needed for smoother animation
      }
    };

    iterateToLatest(startIndex);
  };

  useEffect(() => {
    // Update the chart to show the latest coordinate on initial load
    if (data.length > 0) {
      const lastIndex = data.length - 1;
      setCurrentIndex(lastIndex);
      setLatestData({
        datasets: [{
          label: 'Cart Position',
          data: [{ x: data[lastIndex].x_axis, y: data[lastIndex].y_axis }],
          backgroundColor: 'blue',
        }]
      });
    }
  }, [data]);

  return (
    <div>
      <h1>Cart Movement</h1>
      <Scatter
        data={latestData}
        options={{
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              min: 0,
              max: 200,
              ticks: {
                    display: true,
                },

                // to remove the x-axis grid
              grid: {
                    drawBorder: true,
                    display: true,
                },
            },
            y: {
              type: 'linear',
              position: 'left',
              min: 0,
              max: 250,
              ticks: {
                    display: true,
                    beginAtZero: true,
                },
                // to remove the y-axis grid
              grid: {
                    drawBorder: true,
                    display: true,
                },
            },
          },
          elements: {
            point: {
              radius: 5,
              backgroundColor: 'blue'
            }
          },
          animation: false
        }}
      />
      <div>
        <Slider
          value={currentIndex}
          min={0}
          max={data.length - 1}
          onChange={handleSliderChange}
          aria-labelledby="cart-movement-slider"
        />
      </div>
    </div>
  );
};

export default CartMovement;