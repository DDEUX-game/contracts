# DD Smart Contracts

>  the first NFT a user gets is a [simple & free OG Access Key](https://thirdweb.com/mumbai/0xe003E4487f62cf8fa6a84C517293780b85aedb86), which, using Thirdweb Auth to confirm ownership, unlocks access to play with the OG Default Deck.  It's a simple ERC1155 "Edition Drop", deployed via the Thirdweb Dashboard.  To learn more about the process, check out this [How To Guide written by Tippi](https://fifestarr-d-gitbook.gitbook.io/fifestarr-d-gitbook/dashboard-or-sdk-nft-access-key-for-dumdums-how-to-guide-devrel-uni-part-1), or look through the codebase of our frontend.  

1. DDRankedAccess.sol: The first paid purchase in-game, this is a ERC721 which allows user to save their match history into DDRankedMatches.sol.  We use Chainlink Price Feeds to get live price conversion data on the MATIC the user sends in. We deployed to MATIC Mumbai Testnet because of Polygon's EVM compatability, high speed and low cost. For mainnet launch, we want the price of this NFT to be $2, but for this Hackathon (and testnet deployment) I set the price to be $0.02 of MATIC (because it's hard to get a lot of MATIC Mumbai). 
2. Technically, our backend has the private key with permissions to access DDRankedMatches, but there is check in the contract to make sure one of the users holds a Ranked Access NFT (see above) before triggering the save. This custom smart contract was written by Tippi with help from ChatGPT. 

## Struggles and Roadmap

> tests are in the test folder, had some struggles.

- Testing the chainlink related functions using hardhat test
- deploying via npx thirdweb deploy (and then using the dashboard to actually deploy) was cool and safe, but due to my ISP sometimes blocking Pinata, I lost time from this bug
- Overriding the tokenURI for fixed metadata
- Simplifying and improving the [code from this tutorial](https://blog.developerdao.com/create-nft-smart-contract-with-thirdweb-and-chainlink).
- Unsure about the optimimum way to let users make their own decks/cards.

## Getting Started

Create a project using this example:

```bash
npx thirdweb create --contract --template hardhat-javascript-starter
```

You can start editing the page by modifying `contracts/Contract.sol`.

To add functionality to your contracts, you can use the `@thirdweb-dev/contracts` package which provides base contracts and extensions to inherit. The package is already installed with this project. Head to our [Contracts Extensions Docs](https://portal.thirdweb.com/contractkit) to learn more.

## Building the project

After any changes to the contract, run:

```bash
npm run build
# or
yarn build
```

to compile your contracts. This will also detect the [Contracts Extensions Docs](https://portal.thirdweb.com/contractkit) detected on your contract.

## Deploying Contracts

When you're ready to deploy your contracts, just run one of the following command to deploy you're contracts:

```bash
npm run deploy
# or
yarn deploy
```

## Releasing Contracts

If you want to release a version of your contracts publicly, you can use one of the followings command:

```bash
npm run release
# or
yarn release
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
