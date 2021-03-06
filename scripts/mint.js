const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const MNEMONIC = process.env.MNEMONIC
const INFURA_KEY = process.env.INFURA_KEY
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const NUM_PUFFS = 12
const NUM_SALE_ITEMS = 4

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK || !CONTRACT_ADDRESS) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const ABI = [{
    "constant": false,
    "inputs": [{ "name": "_to", "type": "address" },
        { "name": "_tokenURI", "type": "string" }
    ],
    "name": "mintTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

async function main() {
    const web3Instance = new web3(
        new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/${INFURA_KEY}`)
    )

    const itemContract = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })

    for (var i = 0; i < NUM_PUFFS; i++) {
        const puffId = i + 1
        const result = await itemContract.methods.mintTo(OWNER_ADDRESS,
            `https://cryptopuffs-api.herokuapp.com/api/puff/${puffId}`).send({ from: OWNER_ADDRESS });
        console.log(result.transactionHash)
    } 


    // Presale configuration. Uncomment if you want to mint lootboxes.
    // const saleItemContract = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })
    // for (var i = 0; i < NUM_PUFFS; i++) {
    //     const lootboxId = i + 1
    //     const result = await itemContract.methods.mintTo(OWNER_ADDRESS,
    //         `https://cryptopuffs-api.herokuapp.com/api/lootbox/${lootboxId}`).send({ from: OWNER_ADDRESS });
    //     console.log(result.transactionHash)
    // }
}

main()