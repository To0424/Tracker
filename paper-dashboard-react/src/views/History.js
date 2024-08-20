import React, { useState, useEffect } from 'react'; // Import React hooks
import mqtt from 'mqtt'; // Import MQTT
import { Row, Col, Button, Input, FormGroup, Label } from 'reactstrap'; // Import components from Reactstrap
import RotationButtons from 'variables/Movement_Func/RotationButtons';
import ZoomSlider from 'variables/Movement_Func/ZoomSlider';
import HistoryMapComponent from '../variables/History_Func/HistoryMapComponent';

const MQTT_BROKER = 'ws://broker.hivemq.com:8000/mqtt';
const MQTT_HISTORY_REQUEST_TOPIC = 'cart/history/request';
const MQTT_HISTORY_RESPONSE_TOPIC = 'cart/history/response';

const History = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [tagId, setTagId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(1); // Default to floor 1
  const [rotation, setRotation] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

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
        setHistoricalData(Array.isArray(history) ? history : []);
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  const requestHistoricalData = () => {
    if (tagId && !isNaN(tagId)) { // Validate tag ID
      const client = mqtt.connect(MQTT_BROKER);
      const payload = JSON.stringify({ tag_id: tagId, start_time: startTime, end_time: endTime });
      client.publish(MQTT_HISTORY_REQUEST_TOPIC, payload);
      console.log('Requested historical data:', payload);
    } else {
      alert("Please enter a valid numeric tag ID.");
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 16);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    setStartTime(lastWeek.toISOString().slice(0, 16));
    setEndTime(today);
  }, []);

  return (
    <div className="content">
      <Row>
        <Col md="6">
          <FormGroup>
            <Label for="tagId">Tag ID</Label>
            <Input
              type="text"
              id="tagId"
              placeholder="Enter Tag ID"
              value={tagId}
              onChange={(e) => setTagId(e.target.value.replace(/\D/g, ''))}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="startTime">Start Time</Label>
            <Input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="endTime">End Time</Label>
            <Input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Select Floor</Label>
            <Input type="select" onChange={(e) => setSelectedFloor(parseInt(e.target.value, 10))}>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md="12" className="d-flex justify-content-end">
          <Button color="primary" onClick={requestHistoricalData}>
            Request History
          </Button>
        </Col>
      </Row>

      <RotationButtons
        onRotateLeft={() => setRotation((prev) => (prev - 90) % 360)}
        onRotateRight={() => setRotation((prev) => (prev + 90) % 360)}
        onResetRotation={() => setRotation(0)}
      />
      <ZoomSlider
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
      />

      <HistoryMapComponent
        data={historicalData.filter(point => point.floor === selectedFloor)}
        rotation={rotation}
        zoomLevel={zoomLevel}
      />
    </div>
  );
};

export default History;
