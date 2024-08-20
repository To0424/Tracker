export const getHistoryChartOptions = (rotation, zoomLevel) => {
    const gridStepSize = 50;
  
    return {
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 1500,
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
          max: 1500,
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
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
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
  