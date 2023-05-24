// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract ChatApp {
    struct User {
        string name;
        address[] friends;
        mapping(address => bool) friendMap;
    }
    struct Message {
        address sender;
        uint256 timestamp;
        string text;
    }

    mapping(address => User) users;
    mapping(bytes32 => Message[]) messages;

    function register(string calldata _name) external {

        require(!userExists(msg.sender), "User has already registered!");

        users[msg.sender].name = _name;
    }

    function addFriend(address _friend) external {
        require(userExists(msg.sender), "User not found!!");
        require(msg.sender != _friend, "Adding yourself as a friend is not allowed!!");
        require(isFriend(msg.sender,_friend)==false, "These users are already friends!");
        User storage user = users[msg.sender];

        if (!user.friendMap[_friend]) {
            user.friendMap[_friend] = true;
            user.friends.push(_friend);

            User storage friend = users[_friend];
            friend.friendMap[msg.sender] = true;
            friend.friends.push(msg.sender);
        }
    }

    function sendMessage(address _friend, string calldata _text) external {
        require(userExists(msg.sender), "User not found!!");
        bytes32 chatId = getChatId(msg.sender, _friend);
        Message memory message = Message(msg.sender, block.timestamp, _text);
        messages[chatId].push(message);
    }

    function readMessages(address _friend) external view returns (Message[] memory) {
        bytes32 chatId = getChatId(msg.sender, _friend);
        return messages[chatId];
    }
 
    function getFriends() external view returns (address[] memory) {
        User storage user = users[msg.sender];
        return user.friends;
    }

    function getUsername() external view returns (string memory) {
        User storage user = users[msg.sender];
        return user.name;
    }

    function userExists(address _user) public  view returns (bool) {
        return bytes(users[_user].name).length > 0;
    }

    function isFriend(address _user, address _friend) public view returns (bool) {
        return users[_user].friendMap[_friend];
    }

 function getChatId(address _user1, address _user2) public pure returns (bytes32) {
    if (_user1 < _user2) {
        return keccak256(abi.encodePacked(_user1, _user2));
    } else {
        return keccak256(abi.encodePacked(_user2, _user1));
    }
}

}
