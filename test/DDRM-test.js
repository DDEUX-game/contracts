const { expect } = require("chai");

describe("RankedMatches Contract", function () {
  let RankedMatches, rankedMatches, DDRankedAccess, ddRankedAccess, owner, addr1, addr2;

  beforeEach(async () => {
    // Deploy the DDRankedAccess contract
    // DDRankedAccess = await ethers.getContractFactory("DDRankedAccess");
    DDRankedAccess = await ethers.getContractFactory("IDDRankedAccess");

    ddRankedAccess = await DDRankedAccess.deploy();
    await ddRankedAccess.deployed();

    // Deploy the RankedMatches contract
    // RankedMatches = await ethers.getContractFactory("DDRankedMatches");
    // rankedMatches = await RankedMatches.deploy();
    // await rankedMatches.deployed();
    RankedMatches = await ethers.getContractFactory("DDRankedMatches");
    rankedMatches = await RankedMatches.deploy(ddRankedAccess.address); // Pass the address here
    await rankedMatches.deployed();
    

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  describe("Record Match", function () {
    it("Should record a match", async function () {
      // Example data for the match
      const player1 = addr1.address;
      const player2 = addr2.address;
      const winner = player1;
      const cardIndex1 = 1;
      const cardIndex2 = 2;
      const questions = [ethers.utils.formatBytes32String("Question1")];
      const answers = [true];

      // Assuming you have a function in DDRankedAccess contract to mint access tokens
      // Mint tokens for the players
      await ddRankedAccess.mint(player1);
      await ddRankedAccess.mint(player2);

      // Record the match
      await rankedMatches.recordMatch(player1, player2, winner, cardIndex1, cardIndex2, questions, answers);

      // Retrieve the recorded match
      const recordedMatch = await rankedMatches.matches(0);

      // Verify that the match data is correctly recorded
      expect(recordedMatch.player1).to.equal(player1);
      expect(recordedMatch.player2).to.equal(player2);
      expect(recordedMatch.winner).to.equal(winner);
      expect(recordedMatch.cardIndex1).to.equal(cardIndex1);
      expect(recordedMatch.cardIndex2).to.equal(cardIndex2);
      expect(recordedMatch.questions[0]).to.equal(questions[0]);
      expect(recordedMatch.answers[0]).to.equal(answers[0]);
    });

    it("Should not allow a player without an access key to record a match", async function () {
      // Example data for the match
      const player1 = addr1.address;
      const player2 = addr2.address;
      const winner = player1;
      const cardIndex1 = 1;
      const cardIndex2 = 2;
      const questions = [ethers.utils.formatBytes32String("Question1")];
      const answers = [true];

      // Attempt to record the match without minting tokens
      await expect(rankedMatches.recordMatch(player1, player2, winner, cardIndex1, cardIndex2, questions, answers)).to.be.revertedWith("One or both of the players do not own an access key");
    });

    // You can add more tests like testing the cooldown functionality and access control.
  });
});
