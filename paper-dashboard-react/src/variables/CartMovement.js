import React from "react";
import MapComponent from "./MapComponent"; // Path to your map component
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';

const CartMovement = ({ data, selectedFloor }) => {
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex align-items-center justify-content-between">
              <CardTitle tag="h5" className="mb-0">
                Current Floor: <span style={{ color: 'blue' }}>Floor {selectedFloor}</span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              {data.length === 0 ? (
                <p>No data available for the selected floor.</p>
              ) : (
                <MapComponent data={data} />
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
