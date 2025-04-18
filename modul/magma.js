require("dotenv").config();
const ethers = require("ethers");
const colors = require("colors");
const cfonts = require("cfonts");
const displayHeader = require("../src/banner.js");

displayHeader();

const RPC_URL = "https://testnet-rpc.monad.xyz";
const EXPLORER_URL = "https://testnet.monadexplorer.com/tx/";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contractAddress = "0x2c9C959516e9AAEdB2C748224a41249202ca8BE7";
const gasLimitStake = 500000;
const gasLimitUnstake = 800000;

function getRandomAmount() {
  const min = 0.1;
  const max = 0.9;
  const randomAmount = Math.random() * (max - min) + min;
  return parseFloat(randomAmount.toFixed(4));
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function stakeMON() {
    try {
        const stakeAmount = getRandomAmount();
		console.log(`🪫  Starting Magma ⏩⏩⏩⏩`.blue);
        console.log(` `);
        console.log(`🔄 Magma stake: ${ethers.utils.formatEther(stakeAmount)} MON`.magenta);

        const tx = {
            to: contractAddress,
            data: "0xd5575982",
            gasLimit: ethers.utils.hexlify(gasLimitStake),
            value: stakeAmount,
        };

		console.log(`🔄 STAKE`.green);
        const txResponse = await wallet.sendTransaction(tx);
        console.log(`➡️  Hash: ${txResponse.hash}`.yellow);
		console.log(`🔄 Wait Confirmation`.green);
        await txResponse.wait();
        console.log(`✅ Stake DONE`.green);

        return stakeAmount;
    } catch (error) {
        console.error(`❌ Staking failed:`.red, error.message);
        throw error;
    }
}

async function unstakeGMON(amountToUnstake) {
    try {
        console.log(`🔄 Unstake: ${ethers.utils.formatEther(amountToUnstake)} gMON`.green);

        const functionSelector = "0x6fed1ea7";
        const paddedAmount = ethers.utils.hexZeroPad(amountToUnstake.toHexString(), 32);
        const data = functionSelector + paddedAmount.slice(2);

        const tx = {
            to: contractAddress,
            data: data,
            gasLimit: ethers.utils.hexlify(gasLimitUnstake),
        };

		console.log(`🔄 Unstake`.red);
        const txResponse = await wallet.sendTransaction(tx);
        console.log(`➡️ Hash: ${txResponse.hash}`.yellow);
		console.log(`🔄 Wait Confirmation`.green);
        await txResponse.wait();
        console.log(`✅ Unstake DONE`.green);
    } catch (error) {
        console.error(`❌ Unstaking failed:`.red, error.message);
        throw error;
    }
}

async function runAutoCycle() {
    try {
        const stakeAmount = await stakeMON();
		console.log(`🔄 wait`.yellow);
        await delay(73383);
        await unstakeGMON(stakeAmount);
    } catch (error) {
        console.error(`❌ Failed:`.red, error.message);
    }
}

runAutoCycle();
