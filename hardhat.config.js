require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const {
    //Add Polygon Mumbai URL
    ALCHEMY_API_URL_MUMBAI,
    PRIVATE_KEY
} = process.env;
module.exports = {
    solidity: "0.8.7",
    networks: {
        // Add Polygon Mumbai network
        mumbai: {
            url: ALCHEMY_API_URL_MUMBAI,
            accounts: [`0x${PRIVATE_KEY}`]
        },
    },
}