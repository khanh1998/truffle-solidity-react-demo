pragma solidity ^0.8.4;

contract Ownable {
    address payable owner;
    
    constructor() {
        owner = payable(msg.sender);
    }
    
    modifier onlyOwner() {
        require(isOwner(), "only owner can do");
        _;
    }
    
    function isOwner() public view returns(bool) {
        return msg.sender == owner;
    }
}
