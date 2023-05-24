import React from "react";
import { Row, Card } from "react-bootstrap";
export function Message(props) {
  return (
    <Row style={{ marginRight: "0px" }}>
      <Card 
        border="success"
        style={{
          width: "80%",
          alignSelf: "center",
          margin: "0 0 5px " + props.marginLeft,
          float: "right",
          right: "0px",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0px 3px 6px",
          borderRadius: "10px",
          background: "#ffffff",
          color: "#242526",
        }}
      >
        <Card.Body>
          <h6 style={{ float: "right", color: "gray" }}>{props.timeStamp}</h6>
          <Card.Subtitle style={{ fontWeight: "bold", color: "#661AE6" }}>
            {props.sender}
          </Card.Subtitle>
          <Card.Text style={{ color: "#020205" }}>{props.data}</Card.Text>
        </Card.Body>
      </Card>
    </Row>
  );
}