const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Faucet', function () {
  // Fixture. Reusa os passos nos testes
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner] = await ethers.getSigners();

    console.log('Signer 1 address: ', owner.address);

    return { faucet, owner };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should block withdrawals greather than 0.1 ETH', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);

    let withdrawAmount = ethers.parseUnits("1");
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('should allow withdrawals of 0.1 ETH', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);

    let withdrawAmount = ethers.parseUnits("0.05");
    await expect(faucet.withdraw(withdrawAmount)).to.be.ok;
  });

  it('should withdraw all ETH from owner account', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);
    faucet.withdrawAll();
    let withdrawAmount = ethers.parseUnits("0.05");
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });
});