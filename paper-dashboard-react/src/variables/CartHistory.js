import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Input, FormGroup, Label } from 'reactstrap';
import { Chart as ChartJS, PointElement, LinearScale, Tooltip, Legend, LineElement } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import mqtt from 'mqtt';

ChartJS.register(PointElement, LinearScale, Tooltip, Legend, LineElement, annotationPlugin);

const colors = ['blue', 'red', 'green', 'orange', 'purple', 'brown'];

const CartHistory = ({ data = [], requestHistoricalData }) => {
  const [tagId, setTagId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(1); // Default floor
  const [datasetsArray, setDatasetsArray] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch available tags from backend
    fetch('/api/tags')
      .then(response => response.json())
      .then(data => setAvailableTags(data))
      .catch(error => console.error('Error fetching tags:', error));
  }, []);

  useEffect(() => {
    // Initialize the end date to today
    const today = new Date().toISOString().slice(0, 16);
    setEndTime(today);

    // Initialize the start date to one week before today
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    setStartTime(lastWeek.toISOString().slice(0, 16));
  }, []);

  const handleRequest = () => {
    if (tagId && !isNaN(tagId)) { // Ensure tagId is numeric
      requestHistoricalData(tagId, startTime, endTime, selectedFloor);
    } else {
      alert("Please enter a valid numeric tag ID.");
    }
  };

  useEffect(() => {
    console.log('Data received in CartHistory:', data);
  }, [data]);

  useEffect(() => {
    const datasets = Array.isArray(data) ? data.reduce((acc, point, index) => {
      if (point.floor !== selectedFloor) return acc; // Filter by selected floor
      if (!acc[point.tag_id]) {
        acc[point.tag_id] = {
          label: `Tag: ${point.tag_id}`,
          data: [],
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          pointStyle: 'circle', // Custom point style
          pointRadius: 6, // Custom point radius
          showLine: true,
          fill: false,
        };
      }
      acc[point.tag_id].data.push({ x: point.x_axis, y: point.y_axis, timestamp: point.timestamp });
      return acc;
    }, {}) : {};

    setDatasetsArray(Object.values(datasets));
  }, [data, selectedFloor]);

  const today = new Date().toISOString().slice(0, 16);

  const annotations = datasetsArray.flatMap(dataset => {
    if (dataset.data.length < 2) return [];
    const start = dataset.data[0];
    const end = dataset.data[dataset.data.length - 1];

    return [
      {
        type: 'point',
        xValue: start.x,
        yValue: start.y,
        backgroundColor: 'green',
        borderColor: 'green',
        radius: 5,
        label: {
          content: 'Start',
          enabled: true,
          position: 'top'
        }
      },
      {
        type: 'point',
        xValue: end.x,
        yValue: end.y,
        backgroundColor: 'red',
        borderColor: 'red',
        radius: 5,
        label: {
          content: 'End',
          enabled: true,
          position: 'top'
        }
      }
    ];
  });

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">History</CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <FormGroup>
                  <Label for="tagId">Tag ID</Label>
                  <Input
                    type="text"
                    id="tagId"
                    placeholder="Enter Tag ID"
                    value={tagId}
                    onChange={(e) => setTagId(e.target.value.replace(/\D/g, ''))} // Only allow digits
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="startTime">Start Time</Label>
                  <Input
                    type="datetime-local"
                    id="startTime"
                    value={startTime}
                    max={today}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="endTime">End Time</Label>
                  <Input
                    type="datetime-local"
                    id="endTime"
                    value={endTime}
                    max={today}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </FormGroup>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Select Floor</Label>
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret>
                          Select Floor
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => setSelectedFloor(1)}>Floor 1</DropdownItem>
                          <DropdownItem onClick={() => setSelectedFloor(2)}>Floor 2</DropdownItem>
                          <DropdownItem onClick={() => setSelectedFloor(3)}>Floor 3</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                  </Col>
                  <Col md={6} className="d-flex align-items-end justify-content-end">
                    <Button color="primary" onClick={handleRequest}>Request History</Button>
                  </Col>
                </Row>
                <div className="mt-3">
                  <h5 className="text-center">Currently Viewing Floor {selectedFloor}</h5>
                </div>
              </div>
              {datasetsArray.length > 0 ? (
                <Scatter
                  data={{ datasets: datasetsArray }}
                  options={{
                    scales: {
                      x: {
                        type: 'linear',
                        position: 'bottom',
                        min: 0,
                        max: 1500,
                        ticks: { display: true },
                        grid: { drawBorder: true, display: true },
                      },
                      y: {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: 1500,
                        ticks: { display: true, beginAtZero: true },
                        grid: { drawBorder: true, display: true },
                      },
                    },
                    elements: {
                      point: {
                        radius: 6, // Default point radius
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Default point color
                        borderColor: 'rgba(75, 192, 192, 1)', // Default point border color
                      }
                    },
                    animation: false,
                    plugins: {
                      legend: {
                        labels: {
                          usePointStyle: true, // Use point style instead of rectangle
                          pointStyle: 'circle', // Custom point style
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const timestamp = context.raw.timestamp;
                            return `Timestamp: ${timestamp}`;
                          }
                        }
                      },
                      annotation: {
                        annotations: annotations
                      }
                    }
                  }}
                />
              ) : (
                <p>No data available for the selected range.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartHistory;
