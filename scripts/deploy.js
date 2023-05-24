const main = async () => {
  const Chat_App = await hre.ethers.getContractFactory('ChatApp');
  const ChatApp = await Chat_App.deploy();
  await ChatApp.deployed();
  console.log('Contract deployed to:', ChatApp.address);
};
const runMain = async () => {
  try {
      await main()
      process.exit(0);
  } catch (error) {
      console.log(error);
      process.exit(1);
  }
};
runMain();