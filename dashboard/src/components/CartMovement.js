import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';
import Slider from '@mui/material/Slider';

// Register Chart.js components
ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

const CartMovement = () => {
  const [allData, setAllData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [latestData, setLatestData] = useState({ datasets: [{ data: [] }] });
  const [autoPull, setAutoPull] = useState(true);
  const autoPullTimeout = useRef(null);
  const bgImageRef = useRef(null);
  const cartImageRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data/');
        setAllData(response.data);
        setLatestData({
          datasets: [{
            label: 'Cart Position',
            data: [{ x: response.data[0].x_axis, y: response.data[0].y_axis }],
            backgroundColor: 'blue',
          }]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchInitialData();
    
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

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data/');
        setAllData(response.data);
        if (autoPull) {
          // If auto-pull is enabled, smoothly transition through coordinates
          if (currentIndex < response.data.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            const nextPoint = response.data[nextIndex];
            setLatestData({
              datasets: [{
                label: 'Cart Position',
                data: [{ x: nextPoint.x_axis, y: nextPoint.y_axis }],
                backgroundColor: 'blue',
              }]
            });
          }
        }
      } catch (error) {
        console.error('Error fetching latest data:', error);
      }
    };

    const intervalId = setInterval(fetchLatestData, 1000); // Fetch new data every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [autoPull, currentIndex]);

  const handleSliderChange = (event, newValue) => {
    setCurrentIndex(newValue);
    const selectedPoint = allData[newValue];
    setLatestData({
      datasets: [{
        label: 'Cart Position',
        data: [{ x: selectedPoint.x_axis, y: selectedPoint.y_axis }],
        backgroundColor: 'blue',
      }]
    });
    setAutoPull(false); // Disable auto-pull on manual change

    // Clear any existing timeout
    if (autoPullTimeout.current) {
      clearTimeout(autoPullTimeout.current);
    }

    // Re-enable auto-pull after a delay
    autoPullTimeout.current = setTimeout(() => {
      setAutoPull(true);
    }, 2000); // Adjust the delay as needed
  };

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
            ctx.drawImage(cartImageRef.current, point.x - 15, point.y - 15, 30, 30); // Adjust the size and position as needed
          }
        });
      });
    }
  };
  console.log('Current Index:', currentIndex);

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
              max: 500,
            },
            y: {
              type: 'linear',
              position: 'left',
              min: 0,
              max: 250,
            },
          },
          elements: {
            point: {
              radius: 0 // Hide the default points
            }
          }
        }}
        plugins={[backgroundPlugin, customPointPlugin]}
      />
      <div>
        <Slider
          value={currentIndex}
          min={0}
          max={allData.length - 1}
          onChange={handleSliderChange}
          aria-labelledby="cart-movement-slider"
        />
      </div>
    </div>
  );
};

export default CartMovement;