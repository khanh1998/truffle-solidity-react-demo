const itemManager = artifacts.require("./ItemManager.sol")

contract('ItemManager', async (accounts) => {
    it('should be add an new item', async () => {
        const instance = await itemManager.deployed()
        const name = 'TBP'
        const price = 123
        const res = await instance.createItem(name, price, { from: accounts[0] })
        console.log({ res });
        const arg = res.logs[0].args[0]
        console.log({ arg });
        assert.equal(res.logs[0].args[0]._itemIndex, 0, "first item should have index zero")
        const item = await instance.items(0)
        console.log({ item })
        assert.equal(item._indentifier, name, "indentifier should be equal to name")
    })
})