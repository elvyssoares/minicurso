// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

contract Faucet {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }
  
  function withdraw(uint _amount) payable public {
    // Usuários só podem sacar .1 ETH por vez
    require(_amount <= 100000000000000000);
    (bool sent, ) = payable(msg.sender).call{value: _amount}("");
    require(sent, "Failed to send Ether");
  }

  function withdrawAll() onlyOwner public {
    (bool sent, ) = owner.call{value: address(this).balance}("");
    require(sent, "Failed to send Ether");
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}