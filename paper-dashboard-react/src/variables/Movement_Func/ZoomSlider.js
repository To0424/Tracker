import React from 'react';
import { Input } from 'reactstrap';

const ZoomSlider = ({ zoomLevel, onZoomChange }) => {
  return (
    <div style={{ marginLeft: '20px', width: '200px' }}>
      <Input
        type="range"
        min="50"
        max="100"
        value={zoomLevel}
        onChange={(e) => onZoomChange(e.target.value)}
      />
      <div style={{ textAlign: 'center', marginTop: '5px' }}>
        Zoom: {zoomLevel}%
      </div>
    </div>
  );
};

export default ZoomSlider;
