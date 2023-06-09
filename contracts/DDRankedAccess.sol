// SPDX-License-Identifier: MIT
/**
* @author Tippi Fifestarr  Github:Tippi-fifestarr   Twitter:@fifestarr 
* 
* Smart contract access key, allow a user to 1 NFT per wallet. 3 conditions: 
* 1. pay a minimum of $2 to mint, using Chainlinks decentralized oracles. At first, just MATIC, but can add ETH, and others easily.
* 2. own an OG Access Key, this is not currently enforced in the smart contract. However the dApp won't let them buy unless they have it
* 3. haven't minted before. This means only one of these NFT per wallet.
* Using `thirdweb` contractKit and deploy tool. Get real time price conversion using `Chainlink Data Feeds`, 
* built on Aayush's Developer DAO tutorial (https://blog.developerdao.com/create-nft-smart-contract-with-thirdweb-and-chainlink)
* debugged by me, with contract optimization help from Jorropo from the IPFS Office Hours. Thanks Danjo for the ideas about customURI updatability.
*/
pragma solidity ^0.8.0;

// thirdweb contract for ERC-721 token standard
import "@thirdweb-dev/contracts/base/ERC721Base.sol";
// chainlink data feed
import "./priceConverter.sol";
contract RankedAccess5 is ERC721Base {
   using PriceConverter for uint256;
    // string public constant _keyCustomURI = "https://ipfs.io/ipfs/bafkreiaiqsghlpk5zktyau5e6ynqsel2b7fnnx54uyxj4hh7c6q2ofoxx4/";
    // Minimum price of NFT $2 in MATIC (shifted the price to .02 for easy testing), for optimized final draft, send in this price via constructor
    uint256 public constant MINIMUM_USD = 2 * 10 ** 16; //note remember to change this to 2$ on mainnet deploy
    mapping(address => bool) public hasMinted; // next deployment, theres gotta be a smarter way

   /**
    * @dev ERC721Base library's constructor takes four Parameters
    * _name of the NFT, _symbol of the NFT,
    *  _royaltyRecipient (address) who will get a royalty on secondary sale, _royaltyBps (royality percentage)
    * we don't need to set Royality for the purpose of our smart contract. setting _royaltyBps to Zero
    * @param _name: name of the whole NFT bundle Collection
    * @param _symbol: symbol of the whole NFT bundle Collection
   */
   constructor(
       string memory _name,
       string memory _symbol,
       address _royaltyRecipient,
       uint128 _royaltyBps
   )
       ERC721Base(
           _name,
           _symbol,
           _royaltyRecipient,
           _royaltyBps
       )
   {
   }

   /**
    * @dev createToken mint the ERC721 Token / NFT with the check that the user have paid $2 to mint the NFT
    */
  function createToken() public payable
{
    // Require statement to check the user has paid enough to mint the NFT.  Remember to update the error to reflect the actual price
    require(msg.value.getConversionRate() >= MINIMUM_USD, "SEND_MORE_MATIC: Chainlink price feeds says give me more than $0.02");
    // Check that the msg.sender has not minted before
    require(!hasMinted[msg.sender], "ALREADY_MINTED");

    // Mint a single token to the msg.sender
    _mint(msg.sender, 1);

    // automatically send the balance of this contract to the owner of this contract
    (bool callSuccess, ) = payable(owner()).call{value: msg.value}("");
    require(callSuccess,"TRANSFER_FUND_FAIL");
    // Set the value of minted to true for the msg.sender
    hasMinted[msg.sender] = true;
}
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    return "https://ipfs.io/ipfs/bafkreiaiqsghlpk5zktyau5e6ynqsel2b7fnnx54uyxj4hh7c6q2ofoxx4/";
}

   /**
    * @dev function to withdraw funds present in contract address to owner address. In this case, the address that deploy this smart contract
    */
   function withdraw() public onlyOwner(){
       (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
       require(callSuccess,"TRANSFER_FUND_FAIL");
   }

   /**
    * @dev view / Getter function to get the balance of the smart contract
    */
   function getContractBalance() public view returns(uint){
       return address(this).balance;
   }

   // A contract receiving Ether must have at least one of the functions

   // receive() is called if msg.data have value
   fallback() external payable {}

   // receive() is called if msg.data is empty
   receive() external payable {}

}
