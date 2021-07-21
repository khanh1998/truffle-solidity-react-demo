import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: { item: null, itemManager: null },
    newItem: { cost: 0, itemName: "" }
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ItemManagerContract.networks[networkId];
      const ItemManagerInstance = new web3.eth.Contract(
        ItemManagerContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const ItemInstance = new web3.eth.Contract(
        ItemContract.abi,
        ItemContract[networkId] && ItemContract[networkId].address,
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: { item: ItemInstance, itemManager: ItemManagerInstance }
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    const { newItem: oldData } = this.state;
    oldData[name] = value;
    this.setState({ newItem: { ...oldData } })
  }

  handleSubmit = async (event) => {
    const { itemName, cost } = this.state.newItem
    const { itemManager } = this.state.contract
    const fromAdd = this.state.accounts[0]
    console.log({ itemName, cost, fromAdd });
    const localItem = itemManager.methods.createItem(itemName, Number(cost))
    console.log(localItem);
    const response = await localItem.send({ from: fromAdd })
    console.log(response);
    const { returnValues } = response.events.SupplyChainStep
    const { _index, _itemAddress, _step } = returnValues;
    alert(`${_itemAddress}`)
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Supply chain</h1>
        <h2>Items</h2>
        <input type="text" name="itemName" value={this.state.newItem.name} placeholder="Name" onChange={this.handleInputChange} />
        <input type="number" name="cost" value={this.state.newItem.cost} placeholder="Cost" onChange={this.handleInputChange} />
        <button onClick={this.handleSubmit}>Create</button>
        <h2>Add item</h2>
      </div>
    );
  }
}

export default App;
