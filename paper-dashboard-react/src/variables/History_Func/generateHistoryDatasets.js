import { roomItems, roomBoundary } from '../RoomItems';
import { colors } from '../Movement_Func/constants';

// Function to create a colored icon
const createColoredIcon = (color) => {
  const size = 32; // Desired size for the data point image
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const icon = new Image();
  icon.src = `${process.env.PUBLIC_URL}/tag-icon.png`;  // Path to your tag icon

  return new Promise((resolve) => {
    icon.onload = () => {
      // Draw the image scaled down
      ctx.drawImage(icon, 0, 0, size, size);

      // Apply color overlay
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);

      resolve(canvas.toDataURL());
    };
  });
};


export const generateHistoryDatasets = async (data) => {
  const dynamicDatasets = {};

  for (const [index, point] of data.entries()) {
    if (!dynamicDatasets[point.tag_id]) {
      const iconDataUrl = await createColoredIcon(colors[index % colors.length]);

      dynamicDatasets[point.tag_id] = {
        label: `Tag: ${point.tag_id}`,
        data: [],
        pointStyle: new Image(),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        pointRadius: 16,
        showLine: true,
        fill: false,
        showInLegend: true,
      };

      dynamicDatasets[point.tag_id].pointStyle.src = iconDataUrl;
    }

    dynamicDatasets[point.tag_id].data.push({
      x: point.x_axis,
      y: point.y_axis,
      timestamp: point.timestamp,
    });
  }

  const staticDatasets = roomItems.map(item => ({
    label: item.name,
    data: [
      { x: item.x, y: item.y },
      { x: item.x + item.width, y: item.y },
      { x: item.x + item.width, y: item.y + item.height },
      { x: item.x, y: item.y + item.height },
      { x: item.x, y: item.y },
    ],
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: item.color,
    pointStyle: 'rectRot',
    showLine: true,
    fill: false,
    borderWidth: 2,
    pointRadius: 0,
    showInLegend: false,
  }));

  // Include room boundary
  const roomBoundaryDataset = {
    label: roomBoundary.name,
    data: roomBoundary.data,
    borderColor: roomBoundary.borderColor,
    backgroundColor: roomBoundary.backgroundColor,
    showLine: roomBoundary.showLine,
    fill: roomBoundary.fill,
    borderWidth: roomBoundary.borderWidth,
    pointRadius: roomBoundary.pointRadius,
    showInLegend: roomBoundary.showInLegend,
  };

  return {
    datasets: [...Object.values(dynamicDatasets), ...staticDatasets, roomBoundaryDataset],
  };
};
