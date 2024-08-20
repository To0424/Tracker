// src/components/Movement_Func/RotationButtons.js

import React from 'react';
import { Button } from 'reactstrap';

const RotationButtons = ({ onRotateLeft, onRotateRight, onResetRotation }) => (
  <div style={{ position: 'relative', zIndex: 10 }}> {/* Ensure buttons are on top */}
    <Button 
      color="primary" 
      onClick={onRotateLeft} 
      style={{ marginRight: '10px', cursor: 'pointer' }}  // Ensure pointer cursor
    >
      Rotate Left
    </Button>
    <Button 
      color="primary" 
      onClick={onRotateRight} 
      style={{ marginRight: '10px', cursor: 'pointer' }}  // Ensure pointer cursor
    >
      Rotate Right
    </Button>
    <Button 
      color="secondary" 
      onClick={onResetRotation} 
      style={{ cursor: 'pointer' }}  // Ensure pointer cursor
    >
      Reset Rotation
    </Button>
  </div>
);

export default RotationButtons;
