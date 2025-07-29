const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SoulboundNFT contract...");

  const SoulboundNFT = await ethers.getContractFactory("SoulboundNFT");
  const soulboundNFT = await SoulboundNFT.deploy();

  await soulboundNFT.deployed();

  console.log("SoulboundNFT deployed to:", soulboundNFT.address);
  console.log("Network:", network.name);
  console.log("Block number:", await soulboundNFT.provider.getBlockNumber());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 