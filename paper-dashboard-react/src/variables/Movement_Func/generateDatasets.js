import { roomItems } from '../RoomItems';
import { colors } from './constants';

const createColoredIcon = (color) => {
  const size = 32; // Desired size for the data point image
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const icon = new Image();
  icon.src = `${process.env.PUBLIC_URL}/tag-icon.png`;

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

export const generateDatasets = async (data) => {
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
        pointRadius: 16,  // Define the size of the image point
        showLine: false,
        fill: false,
        showInLegend: true,
      };

      // Set the pointStyle to the newly created colored icon
      dynamicDatasets[point.tag_id].pointStyle.src = iconDataUrl;
    }

    // Add the data point
    dynamicDatasets[point.tag_id].data.push({
      x: point.x_axis,
      y: point.y_axis,
      timestamp: point.timestamp,
    });
  }

  // Static datasets (room boundaries, etc.)
  const staticDatasets = roomItems.map(item => ({
    label: item.name,
    data: [
      { x: item.x, y: item.y },
      { x: item.x + item.width, y: item.y },
      { x: item.x + item.width, y: item.y + item.height },
      { x: item.x, y: item.y + item.height },
      { x: item.x, y: item.y },  // Close the rectangle
    ],
    backgroundColor: 'rgba(0, 0, 0, 0)',  // Transparent background
    borderColor: item.color,
    pointStyle: 'rectRot',  // Rectangular point style
    showLine: true,
    fill: false,
    borderWidth: 2,
    pointRadius: 0,  // No visible points for static items
    showInLegend: false,
  }));

  // Room boundary dataset
  const roomBoundaryDataset = {
    label: 'Floor Plan',
    data: [
      { x: 0, y: 0 },
      { x: 700, y: 0 },
      { x: 700, y: 600 },
      { x: 0, y: 600 },
      { x: 0, y: 0 },  // Close the rectangle
    ],
    borderColor: 'black',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    showLine: true,
    fill: false,
    borderWidth: 2,
    pointRadius: 0,
    showInLegend: false,
  };

  return {
    datasets: [...Object.values(dynamicDatasets), ...staticDatasets, roomBoundaryDataset],
  };
};
