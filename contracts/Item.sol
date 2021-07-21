pragma solidity ^0.8.4;

import "./ItemManager.sol";

contract Item {
    uint public priceInWei;
    uint public pricePaid;
    uint public index;
    
    ItemManager parentContract;
    
    constructor(ItemManager _parentContract, uint _index, uint _priceInWei) {
        parentContract = _parentContract;
        index = _index;
        priceInWei = _priceInWei;
    }
    
    receive() external payable {
        require(pricePaid == 0, "Item is sold");
        require(priceInWei == msg.value, "full payment is required");
        pricePaid += msg.value;
        (bool success, ) =address(parentContract).call{value: msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success == true, "The transaction wasn't successful");
    }
    
    fallback() external {
        
    }
}
