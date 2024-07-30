import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import CartMovement from './components/CartMovement';

const MQTT_BROKER = 'ws://broker.hivemq.com:8000/mqtt';
const MQTT_TOPIC = 'cart/position';

const App = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC) {
        const newData = JSON.parse(message.toString());
        const { tag_id } = newData;

        console.log('Received data:', newData);

        setData((prevData) => {
          const updatedData = { ...prevData, [tag_id]: newData };
          console.log('Updated data:', updatedData);
          localStorage.setItem('cartData', JSON.stringify(updatedData));
          return updatedData;
        });
      }
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