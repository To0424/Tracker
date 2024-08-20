import React, { useState, useEffect, useRef } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, useLocation } from "react-router-dom";
import mqtt from 'mqtt';

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import CartMovement from "variables/CartMovement.js";  // Updated path

const MQTT_BROKER = 'ws://broker.hivemq.com:8000/mqtt';
const MQTT_TOPIC = 'cart/position';
const MQTT_HISTORY_REQUEST_TOPIC = 'cart/history/request';
const MQTT_HISTORY_RESPONSE_TOPIC = 'cart/history/response';

var ps;

function Admin(props) {
  const [backgroundColor, setBackgroundColor] = useState("black");
  const [activeColor, setActiveColor] = useState("info");
  const [data, setData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const mainPanel = useRef();
  const location = useLocation();
  const mqttClient = useRef(null);

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  }, []);

  useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  useEffect(() => {
    mqttClient.current = mqtt.connect(MQTT_BROKER);

    mqttClient.current.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.current.subscribe(MQTT_TOPIC);
      mqttClient.current.subscribe(MQTT_HISTORY_RESPONSE_TOPIC);
    });

    mqttClient.current.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC) {
        const newData = JSON.parse(message.toString());
        const { tag_id, floor } = newData;

        console.log('Received data:', newData);

        setData((prevData) => {
          const updatedData = { ...prevData, [tag_id]: newData };
          console.log('Updated data:', updatedData);
          localStorage.setItem('cartData', JSON.stringify(updatedData));
          return updatedData;
        });
      } else if (topic === MQTT_HISTORY_RESPONSE_TOPIC) {
        const history = JSON.parse(message.toString());
        console.log('Received historical data:', history);
        setHistoricalData(Array.isArray(history) ? history : []);
      }
    });

    return () => {
      if (mqttClient.current) {
        mqttClient.current.end();
      }
    };
  }, []);

  const requestHistoricalData = (tagId, startTime, endTime) => {
    const payload = JSON.stringify({ tag_id: tagId, start_time: startTime, end_time: endTime });
    mqttClient.current.publish(MQTT_HISTORY_REQUEST_TOPIC, payload);
    console.log('Requested historical data:', payload);
  };

  const handleActiveClick = (color) => {
    setActiveColor(color);
  };
  const handleBgClick = (color) => {
    setBackgroundColor(color);
  };

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
  };

  const filteredData = Object.values(data).filter((item) => item.floor === selectedFloor);

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={routes}
        bgColor={backgroundColor}
        activeColor={activeColor}
      />
      <div className="main-panel" ref={mainPanel}>
        {/* <DemoNavbar {...props} /> */}
        <Routes>
          {routes.map((prop, key) => {
            return (
              <Route
                path={prop.path}
                element={React.cloneElement(prop.component, { data: filteredData, historicalData, requestHistoricalData })}
                key={key}
                exact
              />
            );
          })}
        </Routes>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Admin;
