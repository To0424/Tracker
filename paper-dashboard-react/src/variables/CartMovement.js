import React, { useState } from "react";
import MapComponent from "./Movement_Func/MapComponent";
import RotationButtons from "./Movement_Func/RotationButtons";
import ZoomSlider from "./Movement_Func/ZoomSlider";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';

const CartMovement = ({ data, selectedFloor }) => {
  const [rotation, setRotation] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleRotate = (angle) => setRotation((prev) => (prev + angle) % 360);
  const handleResetRotation = () => setRotation(0);
  const handleZoomChange = (newZoomLevel) => setZoomLevel(newZoomLevel);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex align-items-center justify-content-between">
              <CardTitle tag="h5" className="mb-0">
                Current Floor: <span style={{ color: 'blue' }}>Floor {selectedFloor}</span>
              </CardTitle>
              <div className="d-flex align-items-center" style={{ position: 'relative', zIndex: 10 }}> {/* Ensure buttons are on top */}
                <RotationButtons 
                  onRotateLeft={() => handleRotate(-90)} 
                  onRotateRight={() => handleRotate(90)} 
                  onResetRotation={handleResetRotation} 
                />
                <ZoomSlider zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
              </div>
            </CardHeader>
            <CardBody style={{ height: '800px' }}>  {/* Set height to ensure container is defined */}
              {data.length === 0 ? (
                <p>No data available for the selected floor.</p>
              ) : (
                <MapComponent 
                  data={data} 
                  rotation={rotation} 
                  zoomLevel={zoomLevel}
                />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Current Coordinates</CardTitle>
            </CardHeader>
            <CardBody>
              {data.map((tag) => (
                <p key={tag.tag_id}>
                  Tag {tag.tag_id}: (x: {tag.x_axis}, y: {tag.y_axis})
                </p>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartMovement;
