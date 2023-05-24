import React from "react";
import { Row, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
export function MessagingCard(props) {
  return (
    <Row style={{ marginRight: "0px" }}>
      <Card
        border="success"
        style={{
          width: "100%",
          alignSelf: "center",
          marginLeft: "15px",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.3)",
          borderRadius: "20px",
          background: "#661AE6",
          color: "white",
          padding: "0.5rem",
          margin:"20px"
        }}
        onClick={() => {
          props.getMessages(props.publicKey);
        }}
      >
        <Card.Body>
          <Card.Title style={{ fontSize: "1.2rem" }}> {props.name} </Card.Title>
          <Card.Subtitle style={{ fontSize: "0.9rem" }}>
            {" "}
            {props.publicKey.length > 20
              ? props.publicKey.substring(0, 20) + " ..."
              : props.publicKey}{" "}
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Row>
  );
}