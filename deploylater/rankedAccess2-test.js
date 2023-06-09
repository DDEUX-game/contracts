// test/rankedAccess2-test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RankedAccess2", function () {
  let RankedAccess2, rankedAccess2, owner, addr1, addr2;
  const URI =
    "https://ipfs.io/ipfs/bafkreiaiqsghlpk5zktyau5e6ynqsel2b7fnnx54uyxj4hh7c6q2ofoxx4";

  beforeEach(async () => {
    RankedAccess2 = await ethers.getContractFactory("RankedAccess2");
    [owner, addr1, addr2] = await ethers.getSigners();
    rankedAccess2 = await RankedAccess2.deploy(
      "AccessKey",
      "AK",
      owner.address,
      0
    );
  });

  it("Should mint a new token when enough MATIC is sent", async function () {
    await rankedAccess2
      .connect(addr1)
      .createToken({ value: ethers.utils.parseEther("0.1") });

    expect(await rankedAccess2.balanceOf(addr1.address)).to.equal(1);
  });

  it("Should set the correct tokenURI after minting", async function () {
    await rankedAccess2
      .connect(addr1)
      .createToken({ value: ethers.utils.parseEther("0.1") });

    const tokenId = (await rankedAccess2.balanceOf(addr1.address)).sub(1);
    expect(await rankedAccess2.tokenURI(tokenId)).to.equal(URI);
  });

  it("Should not allow minting if not enough MATIC is sent", async function () {
    await expect(
      rankedAccess2
        .connect(addr1)
        .createToken({ value: ethers.utils.parseEther("0.01") })
    ).to.be.revertedWith("SEND_MORE_MATIC");
  });

  it("Should not allow an address to mint more than once", async function () {
    await rankedAccess2
      .connect(addr1)
      .createToken({ value: ethers.utils.parseEther("0.1") });

    await expect(
      rankedAccess2
        .connect(addr1)
        .createToken({ value: ethers.utils.parseEther("0.1") })
    ).to.be.revertedWith("ALREADY_MINTED");
  });
});
