import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, PointElement, LinearScale, Tooltip, Legend, LineElement } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(PointElement, LinearScale, Tooltip, Legend, LineElement, annotationPlugin);

const colors = ['blue', 'red', 'green', 'orange', 'purple', 'brown'];

const MapComponent = ({ data }) => {
  const datasets = Array.isArray(data) ? data.reduce((acc, point, index) => {
    if (!acc[point.tag_id]) {
      acc[point.tag_id] = {
        label: `Tag: ${point.tag_id}`,
        data: [],
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        pointStyle: 'circle', // Custom point style
        pointRadius: 6, // Custom point radius
        showLine: true,
        fill: false,
      };
    }
    acc[point.tag_id].data.push({ x: point.x_axis, y: point.y_axis, timestamp: point.timestamp });
    return acc;
  }, {}) : {};

  const annotations = Object.values(datasets).flatMap(dataset => {
    if (dataset.data.length < 2) return [];
    const start = dataset.data[0];
    const end = dataset.data[dataset.data.length - 1];

    return [
      {
        type: 'point',
        xValue: start.x,
        yValue: start.y,
        backgroundColor: 'green',
        borderColor: 'green',
        radius: 5,
        label: {
          content: 'Start',
          enabled: true,
          position: 'top'
        }
      },
      {
        type: 'point',
        xValue: end.x,
        yValue: end.y,
        backgroundColor: 'red',
        borderColor: 'red',
        radius: 5,
        label: {
          content: 'End',
          enabled: true,
          position: 'top'
        }
      }
    ];
  });

  return (
    <Scatter
      data={{ datasets: Object.values(datasets) }}
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
          point: {
            radius: 6, // Default point radius
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Default point color
            borderColor: 'rgba(75, 192, 192, 1)', // Default point border color
          }
        },
        animation: false,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true, // Use point style instead of rectangle
              pointStyle: 'circle', // Custom point style
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const timestamp = context.raw.timestamp;
                return `Timestamp: ${timestamp}`;
              }
            }
          },
          annotation: {
            annotations: annotations
          }
        }
      }}
    />
  );
};

export default MapComponent;
