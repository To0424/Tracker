import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { generateHistoryDatasets } from './generateHistoryDatasets';
import { getHistoryChartOptions } from './HistoryChartOptions';

const HistoryMapComponent = ({ data, rotation, zoomLevel }) => {
  const { datasets } = generateHistoryDatasets(data);
  const options = getHistoryChartOptions(rotation, zoomLevel);

  return (
    <div style={{
      textAlign: 'center',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: `rotate(${rotation}deg) scale(${zoomLevel / 100})`,
      transformOrigin: 'center',
      transition: 'transform 0.3s ease',
      margin: 'auto',
    }}>
      <div style={{ width: '800px', height: '800px', margin: 'auto' }}>
        <Scatter
          data={{ datasets }}
          options={options}
        />
      </div>
    </div>
  );
};

export default HistoryMapComponent;
