const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("RankedAccess5 contract", function () {
  let RankedAccess5;
  let rankedAccess5;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    RankedAccess5 = await ethers.getContractFactory("RankedAccess5");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    rankedAccess5 = await RankedAccess5.deploy(
      "TestToken",
      "TT",
      owner.address,
      0
    );
  });

  describe("Deployment", function () {
    it("Should set the correct token name and symbol", async function () {
      expect(await rankedAccess5.name()).to.equal("TestToken");
      expect(await rankedAccess5.symbol()).to.equal("TT");
    });
  });

  describe("Minting", function () {
    it("Should allow minting with correct payment", async function () {
      const mintTx = await rankedAccess5
        .connect(addr1)
        .createToken({ value: ethers.utils.parseEther("0.1") });
      await mintTx.wait();
      expect(await rankedAccess5.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail if minting twice", async function () {
      const mintTx = await rankedAccess5
        .connect(addr1)
        .createToken({ value: ethers.utils.parseEther("0.1") });
      await mintTx.wait();
      await expect(
        rankedAccess5
          .connect(addr1)
          .createToken({ value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("ALREADY_MINTED");
    });
  });

  describe("Metadata", function () {
    it("Should return correct tokenURI", async function () {
      const mintTx = await rankedAccess5
        .connect(addr1)
        .createToken({ value: ethers.utils.parseEther("0.1") });
      await mintTx.wait();
      expect(await rankedAccess5.tokenURI(1)).to.equal(
        "https://ipfs.io/ipfs/bafkreiaiqsghlpk5zktyau5e6ynqsel2b7fnnx54uyxj4hh7c6q2ofoxx4/"
      );
    });
  });

  describe("Withdrawal", function () {
    it("Should allow the owner to withdraw balance", async function () {
      const mintTx = await rankedAccess5
        .connect(addr1)
        .createToken({ value: ethers.utils.parseEther("0.1") });
      await mintTx.wait();
      const initialBalance = await ethers.provider.getBalance(rankedAccess5.address);
      await rankedAccess5.withdraw();
      expect(await ethers.provider.getBalance(rankedAccess5.address)).to.be.below(initialBalance);
    });

    it("Should not allow non-owners to withdraw balance", async function () {
      await expect(rankedAccess5.connect(addr2).withdraw()).to.be.reverted;
    });
  });

});
