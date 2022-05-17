const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const {interface , bytecode} = require("../compile")

const web3 = new Web3(ganache.provider());
let acc;
let contract,contractAddress;
beforeEach(async()=>{
    acc = await web3.eth.getAccounts();
   contract = await new web3.eth.Contract(JSON.parse(interface))
   .deploy({data:bytecode,argument:[]})
   .send({from:acc[0],gas:"1000000"});
});

describe("lottery",()=>{
    it("contract deployed",()=>{
     assert.ok(contract.options.address)
     contractAddress = contract.options.address;
    });
    it("player enters contract",async()=>{
        await contract.methods.enter().send({
            from:acc[0],
            value:web3.utils.toWei("0.2","ether")
        });
        players = await contract.methods.getPlayers().call({from:acc[0]})
        assert.equal(acc[0],players[0])
    });
    it("only manager can pick winner",async()=>{
        try{
           await contract.methods().pickWinner().call({from:acc[1]});
           assert(false)
        }catch(err){
            assert(err);
        }
    });
    it("multiple accounts can join lottery",async()=>{
        await contract.methods.enter().send({
            from:acc[0],
            value:web3.utils.toWei("0.2","ether")
        })
        await contract.methods.enter().send({
            from:acc[1],
            value:web3.utils.toWei("0.2","ether")
        })
        await contract.methods.enter().send({
            from:acc[2],
            value:web3.utils.toWei("0.2","ether")
        });
        await contract.methods.enter().send({
            from:acc[3],
            value:web3.utils.toWei("0.2","ether")
        });
        players = await contract.methods.getPlayers().call({from:acc[0]})
        assert.equal(acc[0],players[0])
        assert.equal(acc[1],players[1])
        assert.equal(acc[2],players[2])
        assert.equal(acc[3],players[3])
    })
})