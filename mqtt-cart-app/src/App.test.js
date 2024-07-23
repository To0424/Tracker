// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import CartMovement from './components/CartMovement';

const MQTT_BROKER = 'ws://broker.hivemq.com:8000/mqtt';
const MQTT_TOPIC = 'cart/position';

const App = () => {
  const [data, setData] = useState([]);
  const lastProcessedTimestampRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC) {
        try {
          const newData = JSON.parse(message.toString());
          console.log('Received data:', newData);
          
          // Only add the new data point if it has a newer timestamp
          if (!lastProcessedTimestampRef.current || newData.timestamp > lastProcessedTimestampRef.current) {
            setData((prevData) => [...prevData, newData]);
            lastProcessedTimestampRef.current = newData.timestamp;
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
    });

    client.on('error', (error) => {
      console.error('MQTT Connection Error:', error);
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  return (
    <div>
      <h1>Data Points</h1>
      <CartMovement data={data} />
    </div>
  );
};

export default App;