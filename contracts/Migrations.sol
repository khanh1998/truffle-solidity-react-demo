// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.21 <0.7.0;
pragma solidity ^0.8.4;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier restricted() {
    require(msg.sender == owner, "only owner can do");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
