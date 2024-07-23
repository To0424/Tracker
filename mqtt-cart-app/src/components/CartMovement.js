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
  const bgImageRef = useRef(null);
  const cartImageRef = useRef(null);
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
    // Preload images
    const bgImg = new Image();
    bgImg.src = '/bg-image.png';
    bgImg.onload = () => {
      bgImageRef.current = bgImg;
    };

    const cartImg = new Image();
    cartImg.src = '/cart-image.png';
    cartImg.onload = () => {
      cartImageRef.current = cartImg;
    };
  }, []);

  const backgroundPlugin = {
    id: 'background',
    beforeDraw: (chart) => {
      if (chart.chartArea && bgImageRef.current) {
        const { ctx, chartArea } = chart;
        ctx.drawImage(bgImageRef.current, chartArea.left, chartArea.top, chartArea.width, chartArea.height);
      }
    }
  };

  const customPointPlugin = {
    id: 'customPoint',
    afterDraw: (chart) => {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset) => {
        dataset.data.forEach((value, index) => {
          const meta = chart.getDatasetMeta(0);
          const point = meta.data[index];
          if (point && cartImageRef.current) {
            ctx.drawImage(cartImageRef.current, point.x - 15, point.y - 15, 30, 30);
          }
        });
      });
    }
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
                    display: false,
                },

                // to remove the x-axis grid
              grid: {
                    drawBorder: false,
                    display: false,
                },
            },
            y: {
              type: 'linear',
              position: 'left',
              min: 0,
              max: 250,
              ticks: {
                    display: false,
                    beginAtZero: true,
                },
                // to remove the y-axis grid
              grid: {
                    drawBorder: false,
                    display: false,
                },
            },
          },
          elements: {
            point: {
              radius: 0
            }
          },
          animation: false
        }}
        plugins={[backgroundPlugin, customPointPlugin]}
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