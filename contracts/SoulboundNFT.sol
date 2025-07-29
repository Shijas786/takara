// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SoulboundNFT
 * @dev A soulbound NFT that grants posting privileges to Farcaster
 * Once minted, this NFT cannot be transferred
 */
contract SoulboundNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    uint256 public constant MINT_PRICE = 0.0025 ether; // $5 at current ETH price
    uint256 public constant MAX_SUPPLY = 10000;
    
    mapping(address => bool) public hasMinted;
    mapping(uint256 => uint256) public mintTimestamp;
    
    event NFTMinted(address indexed owner, uint256 tokenId, uint256 timestamp);
    
    constructor() ERC721("Shitposter SBT", "SBT") {
        _tokenIds.increment(); // Start from token ID 1
    }
    
    /**
     * @dev Mint a soulbound NFT for posting privileges
     * @param to The address to mint the NFT to
     */
    function mint(address to) external payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(!hasMinted[to], "Already minted");
        require(_tokenIds.current() <= MAX_SUPPLY, "Max supply reached");
        
        uint256 newTokenId = _tokenIds.current();
        _tokenIds.increment();
        
        hasMinted[to] = true;
        mintTimestamp[newTokenId] = block.timestamp;
        
        _safeMint(to, newTokenId);
        
        emit NFTMinted(to, newTokenId, block.timestamp);
    }
    
    /**
     * @dev Override transfer functions to make NFT soulbound
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0) || to == address(0), "Soulbound: Cannot transfer");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
    
    /**
     * @dev Check if user has posting privileges
     * @param user The address to check
     * @return bool True if user has minted the NFT
     */
    function hasPostingPrivileges(address user) external view returns (bool) {
        return hasMinted[user];
    }
    
    /**
     * @dev Get user's NFT token ID
     * @param user The address to check
     * @return uint256 The token ID (0 if not minted)
     */
    function getUserTokenId(address user) external view returns (uint256) {
        if (!hasMinted[user]) return 0;
        
        for (uint256 i = 1; i <= _tokenIds.current() - 1; i++) {
            if (ownerOf(i) == user) {
                return i;
            }
        }
        return 0;
    }
    
    /**
     * @dev Get total supply
     * @return uint256 Total number of NFTs minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current() - 1;
    }
    
    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Override tokenURI to return metadata
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            "eyJuYW1lIjoiU2hpdHBvc3RlciBTQlQiLCJkZXNjcmlwdGlvbiI6IkEgU291bGJvdW5kIE5GVCB0aGF0IGdyYW50cyBwb3N0aW5nIHByaXZpbGVnZXMgdG8gRmFyY2FzdGVyIiwiYXR0cmlidXRlcyI6W3sidHJhaXRfdHlwZSI6IlBvc3RpbmcgUHJpdmlsZWdlcyIsInZhbHVlIjoiQWN0aXZlIn1dfQ=="
        ));
    }
} 