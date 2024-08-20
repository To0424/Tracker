// src/components/Movement_Func/RoomItems.js

// Define the fixed items in the room, such as tables, chairs, doors, etc.
export const roomItems = [
    {
      name: 'Table', // Name of the item
      type: 'table', // Type of the item, can be used for further customization
      x: 200, // x-coordinate position of the top-left corner
      y: 300, // y-coordinate position of the top-left corner
      width: 100, // Width of the table
      height: 50, // Height of the table
      color: 'blue', // Color used to represent this item on the map
    },
    {
      name: 'Door',
      type: 'door',
      x: 50,
      y: 100,
      width: 20, // Width of the door
      height: 60, // Height of the door
      color: 'brown',
    },
    {
      name: 'Chair',
      type: 'chair',
      x: 400,
      y: 350,
      width: 40, // Width of the chair
      height: 40, // Height of the chair
      color: 'green',
    },
    // Add more items as needed
  ];
  