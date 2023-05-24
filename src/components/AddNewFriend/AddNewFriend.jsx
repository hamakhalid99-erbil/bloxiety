import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import './addnewfriend.css'
import { PersonFillAdd } from "react-bootstrap-icons";
export function AddNewFriend(props) {
  const [publicKey, setPublicKey] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAddFriend = () => {
    props.addHandler(name, publicKey);
    handleClose();
  };

  const handleClose = () => {
    setPublicKey("");
    setName("");
    setShowModal(false);
  };

  const handleShow = () => setShowModal(true);

  return (
    <div
      className="AddNewFriend"
      style={{
        position: "absolute",
        bottom: "10px",
        padding: "20px",
        margin: "0 95px 0 0",
        width: "90%",
        borderRadius: "5px",
        textAlign: "center",
      }}
    >
      <Button
        variant="success"
        className=" addNewFriendButton"
        onClick={handleShow}
      >
        <div style={{display:"flex", padding:"2px" ,alignItems:"start",justifyContent:"start",columnGap:"10px" }}>
          <div> <PersonFillAdd size={19}/></div>
          <div style={{marginTop:"2px"}}>Add Friend</div>
        </div>
      
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#661AE6", color: "#fff" }}
        >
          <Modal.Title>Make a new connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              required
              id="addPublicKey"
              size="text"
              type="text"
              placeholder="Enter Friend's Public Key"
              style={{ marginBottom: "10px" }}
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
            />

          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              backgroundColor: "#fff",
              color: "#111F4D",
              border: "none",
              outline: "none",
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAddFriend}
            style={{
              backgroundColor: "#661AE6",
              border: "none",
              outline: "none",
            }}
          >
            Add Friend
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddNewFriend;
