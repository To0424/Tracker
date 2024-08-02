import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import CartHistory from 'variables/CartHistory.js'; // Updated path

const MQTT_BROKER = 'ws://broker.hivemq.com:8000/mqtt';
const MQTT_HISTORY_REQUEST_TOPIC = 'cart/history/request';
const MQTT_HISTORY_RESPONSE_TOPIC = 'cart/history/response';

const History = () => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(MQTT_HISTORY_RESPONSE_TOPIC, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === MQTT_HISTORY_RESPONSE_TOPIC) {
        const history = JSON.parse(message.toString());
        console.log('Received historical data:', history);
        setHistoricalData(Array.isArray(history) ? history : []);
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  const requestHistoricalData = (tagId, startTime, endTime) => {
    const client = mqtt.connect(MQTT_BROKER);
    const payload = JSON.stringify({ tag_id: tagId, start_time: startTime, end_time: endTime });
    client.publish(MQTT_HISTORY_REQUEST_TOPIC, payload);
    console.log('Requested historical data:', payload);
  };

  return <CartHistory data={historicalData} requestHistoricalData={requestHistoricalData} />;
};

export default History;
