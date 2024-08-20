import React, { useState, useEffect, useRef } from "react";
import CartMovement from "variables/CartMovement.js"; // Path to your graph/map component
import { Card, CardBody, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import mqtt from "mqtt";

const MQTT_BROKER = "ws://broker.hivemq.com:8000/mqtt";
const MQTT_TOPIC = "cart/position";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [selectedFloor, setSelectedFloor] = useState(1); // Default to floor 1
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const mqttClient = useRef(null);

  useEffect(() => {
    mqttClient.current = mqtt.connect(MQTT_BROKER);

    mqttClient.current.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.current.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
      });
    });

    mqttClient.current.on("message", (topic, message) => {
      if (topic === MQTT_TOPIC) {
        const newData = JSON.parse(message.toString());
        const { tag_id, floor } = newData;

        console.log("Received data:", newData);

        setData((prevData) => {
          const updatedData = { ...prevData, [tag_id]: newData };
          console.log("Updated data:", updatedData);
          localStorage.setItem("cartData", JSON.stringify(updatedData));
          return updatedData;
        });
      }
    });

    return () => {
      if (mqttClient.current) {
        mqttClient.current.end();
      }
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
  };

  const handleRotateLeft = () => setRotation((prevRotation) => (prevRotation - 90) % 360);
  const handleRotateRight = () => setRotation((prevRotation) => (prevRotation + 90) % 360);
  const handleResetRotation = () => setRotation(0);

  const floorCounts = Object.values(data).reduce((acc, item) => {
    acc[item.floor] = (acc[item.floor] || 0) + 1;
    return acc;
  }, {});

  const filteredData = Object.values(data).filter((item) => item.floor === selectedFloor);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardBody className="d-flex justify-content-between align-items-center">
              <div>
                Current Floor: <span style={{ color: 'blue' }}>Floor {selectedFloor}</span>
              </div>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret>
                  Select Floor
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleFloorChange(1)}>
                    Floor 1 ({floorCounts[1] || 0} tags)
                  </DropdownItem>
                  <DropdownItem onClick={() => handleFloorChange(2)}>
                    Floor 2 ({floorCounts[2] || 0} tags)
                  </DropdownItem>
                  <DropdownItem onClick={() => handleFloorChange(3)}>
                    Floor 3 ({floorCounts[3] || 0} tags)
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <CartMovement 
            data={filteredData} 
            selectedFloor={selectedFloor} 
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            onResetRotation={handleResetRotation}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
