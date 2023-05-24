const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ChatApp', function () {
  let chatApp;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const ChatApp = await ethers.getContractFactory('ChatApp');
    chatApp = await ChatApp.connect(owner).deploy();
    await chatApp.deployed();
  });

  describe('register', function () {
    it('should allow a user to register', async function () {
      const name = 'Mohammed';
      await chatApp.connect(user1).register(name);
      const username = await chatApp.connect(user1).getUsername();
      expect(username).to.equal(name);
    });
  });

  describe('addFriend', function () {
    it('should allow a user to add a friend', async function () {
      await chatApp.connect(user1).register('Mohammed');
      await chatApp.connect(user2).register('Yad');
      await chatApp.connect(user1).addFriend(user2.address);
      const friends = await chatApp.connect(user1).getFriends();
      expect(friends).to.deep.equal([user2.address]);
    });

  });

  describe('sendMessage', function () {
    it('should allow a user to send a message to a friend', async function () {
      await chatApp.connect(user1).register('Mohammed');
      await chatApp.connect(user2).register('Yad');
      await chatApp.connect(user1).addFriend(user2.address);
      await chatApp.connect(user1).sendMessage(user2.address, 'Hello Yad!');
      const messages = await chatApp.connect(user1).readMessages(user2.address);
      expect(messages[0].text).to.equal('Hello Yad!');
      expect(messages[0].sender).to.equal(user1.address);
    });
  });
});
