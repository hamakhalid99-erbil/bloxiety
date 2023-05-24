import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import {
  NavBar,
  MessagingCard,
  Message,
  AddNewFriend,
} from "./components/Components.js";
import './App.css'
import { abi } from "./abi";
import Web3 from "web3";
import { ArrowClockwise, SendFill } from "react-bootstrap-icons";
import CryptoJS from 'crypto-js';

const CONTRACT_ADDRESS = "0x9173bEA743BE9ae3C6960ad60efe2Fd250E152c6";
export function App(props) {
  const [friends, setFriends] = useState(null);
  const [myName, setMyName] = useState(null);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [activeChat, setActiveChat] = useState({
    friendname: null,
    publicKey: null,
  });
  const [activeChatMessages, setActiveChatMessages] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState("block");
  const [myContract, setMyContract] = useState(null);
  const contractABI = abi;
  let myProvider;
  let signer;

  async function signin() {
    let response = await checkMetamaskConnection();
    console.log(CONTRACT_ADDRESS);
    if (response === true) {
      myProvider = new Web3(window.ethereum);
      const accountWallets = await myProvider.eth.getAccounts();
      signer = accountWallets[0];
      try {
        const contract = new myProvider.eth.Contract(contractABI, CONTRACT_ADDRESS, {
          from: signer,
        });
        console.log("contract: ", contract);
        setMyContract(contract);
        const address = await myProvider.eth.getAccounts();
        console.log("Account address: ", address[0])
        let authenticated = await contract.methods.userExists(address[0]).call();
        let username;
        if (authenticated) username = await contract.methods.getUsername().call();
        else {
          username = prompt("Please enter your prefered username:", "DefaultUser");
          if (username === "") username = "DefaultUser";
          await contract.methods.register(username).send({ from: address[0] });
        }
        setMyName(username);
        setMyPublicKey(address[0]);
        setShowConnectButton("none");
      } catch (err) {
        console.log(err)
        alert("Failed to set contract address!");
      }
    } else {
      alert("Failed to connect to Metamask!!");
    }
  }


  async function checkMetamaskConnection() {
    try {
      await window.ethereum.enable();
      return true;
    } catch (err) {
      return false;
    }
  }

  async function addChat(name, publicKey) {
    try {
      let authenticated = await myContract.methods.userExists(publicKey).call();
      console.log(`if user exists ${authenticated}`)
      if (!authenticated) {
        alert("Address not found: Ask them to join the app :)");
        return;
      }
      try {
        await myContract.methods.addFriend(publicKey).send();
        const frnd = { name: name, publicKey: publicKey };
        setFriends(friends.concat(frnd));
      } catch (err) {
        alert(
          "Looks like you're already friends with this person! You can't add them again ;)"
        );
      }
    } catch (err) {
      alert("Incorrect address!, try another address");
    }
  }

  async function sendMessage(data) {
    if (!(activeChat && activeChat.publicKey)) return;
    const receiverAddress = activeChat.publicKey;
    const encryptedData = CryptoJS.AES.encrypt(data, 
      process.env.REACT_APP_SECRET_CODE).toString();
  
    await myContract.methods.sendMessage(receiverAddress, encryptedData).send();
  }

    async function getMessage(friendsPublicKey) {

    console.log("friend public key:", friendsPublicKey);
    console.log("get message is called");
    let nickname;
    let messages = [];
    console.log("friends", friends);
    friends.forEach((item) => {
      if (item.publicKey === friendsPublicKey) nickname = item.name;
    });
  
    const data = await myContract.methods.readMessages(friendsPublicKey).call();
    console.log("data: ", data);
    data.forEach((item) => {
      console.log();
      const timestamp = new Date(1000 * Number(item.timestamp)).toLocaleString("en-US", {
        timeZone: "Europe/Prague",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      
  
      const decryptedData = CryptoJS.AES.decrypt(item[2], 
        process.env.REACT_APP_SECRET_CODE)
      .toString(CryptoJS.enc.Utf8);
      
      console.log("decrypted data",decryptedData)
      console.log("data", data)
      messages.push({
        publicKey: item[0],
        timeStamp: timestamp,
        data: decryptedData,
      });
    });
  
    setActiveChat({ friendname: nickname, publicKey: friendsPublicKey });
    setActiveChatMessages(messages);
  }
  

  useEffect(() => {
    async function loadFriends() {

      let friendList = [];
      try {
        const data = await myContract.methods.getFriends().call();
        console.log("freinds from contract", data)
        data.forEach((item) => {
          friendList.push({ publicKey: item });
        });
      } catch (err) {
        friendList = null;
      }
      console.log(friendList);
      setFriends(friendList);
    }
    loadFriends();
  }, [myPublicKey, myContract]);

  const Messages = activeChatMessages
    ? activeChatMessages.map((message) => {
      let margin = "5%";
      let sender = activeChat.friendname;
      if (message.publicKey === myPublicKey) {
        margin = "15%";
        sender = "You";
      }
      return (
        <Message
          marginLeft={margin}
          sender={sender}
          data={message.data}
          timeStamp={message.timeStamp}
        />
      );
    })
    : null;

  const chats = friends
    ? friends.map((friend) => {
      return (
        <MessagingCard
          publicKey={friend.publicKey}
          name={friend.name}
          getMessages={(key) => getMessage(key)}
        />
      );
    })
    : null;

  return (
    <Container fluid style={{ height: "100%" }}>
      <NavBar
        username={myName}
        signin={async () => signin()}
        showButton={showConnectButton}
      
      />

      <Row>
        <Col style={{ paddingRight: "1px", height: "85vh" }}>
          <div
            style={{
              backgroundColor: "#2A303C",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginLeft: "15px",
                  backgroundColor:"#343A40",
                  color:"white",
                  fontWeight:"bold"
                }}
                className="members-header"
              >
                <Card.Header >Members</Card.Header>
              </Card>
            </Row>
            {chats}
            <AddNewFriend
              myContract={myContract}
              addHandler={(name, publicKey) => addChat(name, publicKey)}
            />
          </div>
        </Col>
        <Col xs={8} style={{ paddingLeft: "0px", }}>
          <div style={{ backgroundColor: "#2A303C", height: "100%" }}>
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  margin: "0 30px 30px 30px",
                  color:"white",
                  backgroundColor:"#343A40"
                }}
              >
                <Card.Header>
                  <span style={{fontWeight:"bold"}}>Public address</span> <span style={{color:"gray"}}> {activeChat.friendname} : {activeChat.publicKey} </span>
                                   <Button
                    style={{
                      float: "right",
                      backgroundColor: "#2a303c",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "15px",
                      padding: "10px",
                      border: "none",
                      boxShadow: "0px 1px 4px #661AE6"
                    }}
                    onClick={() => {
                      if (activeChat && activeChat.publicKey)
                        getMessage(activeChat.publicKey);
                    }}
                  >
                    <ArrowClockwise/>
                  </Button>
                </Card.Header>
              </Card>
            </Row>
            <div
              className="MessageBox"
              style={{ height: "400px", overflowY: "auto" }}
            >
              {Messages}
            </div>
            <div>
              <div
                className="SendMessage"
                style={{
                  borderTop: "2px solid black",
                  position: "absolute",
                  bottom: "0px",
                  padding: "10px 45px 0 45px",
                  margin: "0 95px 0 0",
                  width: "97%",
                }}
              >
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(document.getElementById("messageData").value);
                    document.getElementById("messageData").value = "";
                  }}
                >
                  <Form.Row className="align-items-center">
                    <Col xs={10}>
                      <Form.Control
                        id="messageData"
                        className="mb-2"
                        placeholder="Write a message ....."
                        style={{backgroundColor:"#343A40", border:"none", color:"white"}}
                        
                      />
                    </Col>
                    <Col>
                      <Button
                        className="mb-2"
                        style={{
                          float: "right",
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
                        onClick={() => {
                          sendMessage(
                            document.getElementById("messageData").value
                          );
                          document.getElementById("messageData").value = "";
                        }}
                      >
                        <SendFill/>
                      </Button>
                    </Col>
                  </Form.Row>
                </Form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}