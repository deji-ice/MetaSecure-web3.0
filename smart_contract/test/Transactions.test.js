const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("Transactions Contract", function () {
  // We define a fixture to reuse the same contract setup in every test
  async function deployTransactionsFixture() {
    // Get signers (accounts)
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the Transactions contract
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();

    return { transactions, owner, addr1, addr2 };
  }

  describe("Transaction Operations", function () {
    it("Should start with zero transactions", async function () {
      const { transactions } = await loadFixture(deployTransactionsFixture);

      // Check that initial transaction count is zero
      expect(await transactions.getTransactionCount()).to.equal(0);

      // Check that initial transactions array is empty
      const allTx = await transactions.getAllTransactions();
      expect(allTx.length).to.equal(0);
    });

    it("Should add a transaction to the blockchain", async function () {
      const { transactions, owner, addr1 } = await loadFixture(
        deployTransactionsFixture
      );

      // Test data
      const receiver = addr1.address;
      const amount = ethers.parseEther("1.0");
      const message = "Test transaction";
      const keyword = "test";

      // Add transaction
      await expect(
        transactions.addToBlockchain(receiver, amount, message, keyword)
      )
        .to.emit(transactions, "Transfer")
        .withArgs(
          owner.address, // Use owner.address directly
          receiver,
          amount,
          message,
          anyValue, // timestamp - can be any value
          keyword
        );

      // Check that transaction count increased
      expect(await transactions.getTransactionCount()).to.equal(1);
    });

    it("Should retrieve all transactions correctly", async function () {
      const { transactions, owner, addr1, addr2 } = await loadFixture(
        deployTransactionsFixture
      );

      // Add multiple transactions
      await transactions.addToBlockchain(
        addr1.address,
        ethers.parseEther("1.0"),
        "First transaction",
        "first"
      );

      await transactions.addToBlockchain(
        addr2.address,
        ethers.parseEther("2.0"),
        "Second transaction",
        "second"
      );

      // Get all transactions
      const allTx = await transactions.getAllTransactions();

      // Verify transaction count
      expect(allTx.length).to.equal(2);

      // Verify first transaction details
      expect(allTx[0].sender).to.equal(owner.address);
      expect(allTx[0].receiver).to.equal(addr1.address);
      expect(allTx[0].amount).to.equal(ethers.parseEther("1.0"));
      expect(allTx[0].message).to.equal("First transaction");
      expect(allTx[0].keyword).to.equal("first");

      // Verify second transaction details
      expect(allTx[1].sender).to.equal(owner.address);
      expect(allTx[1].receiver).to.equal(addr2.address);
      expect(allTx[1].amount).to.equal(ethers.parseEther("2.0"));
      expect(allTx[1].message).to.equal("Second transaction");
      expect(allTx[1].keyword).to.equal("second");
    });

    it("Should update transaction count correctly", async function () {
      const { transactions, addr1, addr2 } = await loadFixture(
        deployTransactionsFixture
      );

      // Initial count should be 0
      expect(await transactions.getTransactionCount()).to.equal(0);

      // Add first transaction
      await transactions.addToBlockchain(
        addr1.address,
        ethers.parseEther("1.0"),
        "Test transaction",
        "test"
      );

      // Count should be 1
      expect(await transactions.getTransactionCount()).to.equal(1);

      // Add second transaction
      await transactions.addToBlockchain(
        addr2.address,
        ethers.parseEther("2.0"),
        "Another transaction",
        "another"
      );

      // Count should be 2
      expect(await transactions.getTransactionCount()).to.equal(2);
    });

    it("Should emit Transfer event with correct parameters", async function () {
      const { transactions, owner, addr1 } = await loadFixture(
        deployTransactionsFixture
      );

      // Test data
      const receiver = addr1.address;
      const amount = ethers.parseEther("1.0");
      const message = "Test transaction";
      const keyword = "test";

      // Check event emission
      await expect(
        transactions.addToBlockchain(receiver, amount, message, keyword)
      )
        .to.emit(transactions, "Transfer")
        .withArgs(
          owner.address, // Use owner.address directly
          receiver,
          amount,
          message,
          anyValue, // timestamp
          keyword
        );
    });
  });
});
