export const getChartOptions = (rotation, zoomLevel) => {
  const gridStepSize = 200;  // Define the step size for both axes
  const axisMax = 2000;  // Set a maximum value for both axes to make the grid square

  return {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: axisMax,
        ticks: {
          display: true,
          beginAtZero: true,
          stepSize: gridStepSize,
        },
        grid: {
          drawBorder: true,
          display: true,
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: axisMax,
        ticks: {
          display: true,
          beginAtZero: true,
          stepSize: gridStepSize,
        },
        grid: {
          drawBorder: true,
          display: true,
        },
      },
    },
    elements: {
      point: {
        radius: 6,  // Default radius for points, can be overridden by the dataset
      },
    },
    animation: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          filter: (legendItem, chartData) => {
            return chartData.datasets[legendItem.datasetIndex].showInLegend && 
                   legendItem.text.startsWith('Tag');
          },
          usePointStyle: true,  // Display the legend with point styles
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label) {
              const timestamp = context.raw.timestamp;
              return `Tag: ${context.dataset.label}, Timestamp: ${timestamp}`;
            }
            return null;
          },
        },
      },
    },
  };
};
