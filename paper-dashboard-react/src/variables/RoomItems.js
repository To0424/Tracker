// src/shared/RoomItems.js

export const roomItems = [
  {
    name: 'Table 1',
    x: 200,
    y: 300,
    width: 100,
    height: 50,
    color: 'blue',
  },
  {
    name: 'Chair 1',
    x: 500,
    y: 400,
    width: 50,
    height: 50,
    color: 'red',
  },
  // Add other room items here...
];

// Room boundary as part of roomItems.js
export const roomBoundary = {
  name: 'Floor Plan',
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
