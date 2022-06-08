const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*" // Any network (default: none)
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC
          },
          providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0
        }),
      network_id: 3,
      gas: 8000000, // gas limit
      gasPrice: 113864531661, // in wei 152414241235
      confirmations: 2,
      timeoutBlocks: 200
    }
  },

  compilers: {
    solc: {
      version: "0.8.11" // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
