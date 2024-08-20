export const getHistoryChartOptions = (rotation, zoomLevel) => {
  const gridStepSize = 200;
  const axisMax = 2000;

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
        radius: 6,
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
          usePointStyle: true,
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
