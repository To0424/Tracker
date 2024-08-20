import { colors } from '../Movement_Func/constants';  // Reuse constants

export const generateHistoryDatasets = (data) => {  // No showLines flag needed, always true for history
  const dynamicDatasets = data.reduce((acc, point, index) => {
    if (!acc[point.tag_id]) {
      acc[point.tag_id] = {
        label: `Tag: ${point.tag_id}`,
        data: [],
        backgroundColor: colors[index % colors.length],  // Use colors for legend
        borderColor: colors[index % colors.length],
        pointStyle: 'circle',  // Default to circle for historical data
        pointRadius: 6,  // Adjust the radius if needed
        showLine: true,  // Always true for history to connect points
        fill: false,
        lineTension: 0,  // Keep lines straight
        borderWidth: 2,  // Thickness of the line
      };
    }
    acc[point.tag_id].data.push({
      x: point.x_axis,
      y: point.y_axis,
      timestamp: point.timestamp,
    });
    return acc;
  }, {});

  return {
    datasets: [...Object.values(dynamicDatasets)],
  };
};
