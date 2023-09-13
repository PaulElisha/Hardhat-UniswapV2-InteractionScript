import { ethers, network } from "hardhat";

const main = async () => {
  const uniswapAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  // Add Liquidity
  const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const quant = "0x4a220E6096B25EADb88358cb44068A3248254675";
  const usdtContract = await ethers.getContractAt("IERC20", usdt);
  const quantContract = await ethers.getContractAt("IERC20", quant);

  const desiredAmountA = ethers.parseEther("10");
  const desiredAmountB = ethers.parseEther("10");

  const minAmtA = ethers.parseEther("0");
  const minAmtB = ethers.parseEther("0");

  const to = "0x3F08f17973aB4124C73200135e2B675aB2D263D9";
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const deadline = currentTimestampInSeconds + 3600;

  const TokenHolder = "0x3F08f17973aB4124C73200135e2B675aB2D263D9";

  await network.provider.send("hardhat_setBalance", [
    TokenHolder,
    "0x8AFE18BB59AA6AB01280",
  ]);
  const tokenSigner = await ethers.getImpersonatedSigner(TokenHolder);

  const uniswap = await ethers.getContractAt("IUniswap", uniswapAddr);

  // Approve USDT to Uniswap

  const approvedValue = ethers.parseEther("100");
  const approve = await usdtContract
    .connect(tokenSigner)
    .approve(uniswapAddr, approvedValue);

  await approve.wait();

  console.log(`Approved ${approvedValue} USDT tokens for Uniswap.`);

  // Approve QUANT to Uniswap

  const approvedVal = ethers.parseEther("100");
  const app = await quantContract
    .connect(tokenSigner)
    .approve(uniswapAddr, approvedVal);

  await app.wait();

  console.log(`Approved ${approvedVal} QUANT tokens for Uniswap.`);

  // Balance Before

  console.log(ethers.formatUnits(String(await usdtContract.balanceOf(to)), 6));
  console.log(
    ethers.formatUnits(String(await quantContract.balanceOf(to)), 18)
  );

  await uniswap
    .connect(tokenSigner)
    .addLiquidity(
      usdt,
      quant,
      desiredAmountA,
      desiredAmountB,
      minAmtA,
      minAmtB,
      to,
      deadline
    );

  // Balance After
  console.log(
    ethers.formatUnits(String(await usdtContract.balanceOf(TokenHolder)), 6)
  );
  console.log(
    ethers.formatUnits(String(await quantContract.balanceOf(TokenHolder)), 18)
  );

  // Remove Liquidity
  // Interact with the Factory Contract Address
  const factoryAddr = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

  const uniFactory = await ethers.getContractAt(
    "IUniswapV2Factory",
    factoryAddr
  );

  const getPair = await uniFactory.connect(tokenSigner).getPair(usdt, quant);
  console.log(getPair);

  // get pair balance
  const pairAddr = "0x3836106ddE89bCa75339bFA6Ca097E650361590F";

  const pairInteract = await ethers.getContractAt("IERC20", pairAddr);

  const pairBalance = await pairInteract.balanceOf(TokenHolder);
  console.log(
    ethers.formatUnits(String(await pairInteract.balanceOf(TokenHolder)))
  );

  // const pairBalance = await pairAddr.balanceof(TokenHolder);
  // await uniswap.connect(tokenSigner).transfer(to, tfVal);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
