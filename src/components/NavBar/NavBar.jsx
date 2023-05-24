import React from "react";
import { Button, Navbar } from "react-bootstrap";
import './navbar.css'
export function NavBar(props) {
  return (
   
    <Navbar
    style={{
      backgroundColor: "#2A303C"
    }}
    >
      <Navbar.Brand href="/" className="nav-title"> <span className=" block">Block</span> <span className="xiety">Xiety</span></Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          <Button
            style={{
              display: props.showButton,
              backgroundColor: "#661AE6",
              border: "none",
              borderRadius: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out"
            }}
            variant="success"
            onClick={async () => {
              props.signin();
            }}
          >
            Link your Metamask wallet
          </Button>
          <div
          className="user-info-wrapper"
            style={{ display: props.showButton === "none" ? "block" : "none" }}
          >
            
            User profile:
            {"  "}
            <span>{props.username}</span>
          </div>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}