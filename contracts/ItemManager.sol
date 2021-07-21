pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./Item.sol";

contract ItemManager is Ownable {
    
    enum ItemState{ CREATED, PAID, DELIVERIED }
    struct S_Item {
        Item item;
        string id;
        uint price;
        ItemState state;
    }
    event SupplyChainStep(uint _index, uint _step, address _itemAddress);
    mapping(uint => S_Item) public items;
    uint itemIndex;
    
    function createItem(string memory _id, uint _price) public onlyOwner {
        Item item = new Item(this, itemIndex, _price);
        items[itemIndex] = S_Item(item, _id, _price, ItemState.CREATED);
        emit SupplyChainStep(itemIndex, uint(items[itemIndex].state), address(item));
        itemIndex++;
    }
    
    function triggerPayment(uint _index) public payable {
        S_Item storage item = items[_index];
        require(item.price == msg.value, 'full payment is required');
        require(item.state == ItemState.CREATED, 'item is not available');
        item.state = ItemState.PAID;
        emit SupplyChainStep(_index, uint(item.state), address(item.item));
    }
    
    function triggerDelivery(uint _index) public onlyOwner {
        S_Item storage item = items[_index];
        require(item.state == ItemState.PAID, 'only paid items are ready to deliver');
        item.state = ItemState.DELIVERIED;
        emit SupplyChainStep(_index, uint(item.state), address(item.item));
    }
}
