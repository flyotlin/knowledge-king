// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

contract KnowledgeKingGame {
    IERC20 public token;
    address private _owner;

    constructor(IERC20 _token) {
        // specify the pre-deployed token address
        token = _token;
        // deployer of the contract is the owner
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not the contract owner");
        _;
    }

    function initPlayer(address player) external onlyOwner {
        // Initialize player with 5 tokens
        require(token.balanceOf(_owner) >= 5 * 10 ** 18, "Not enough tokens in contract");
        token.transferFrom(_owner, player, 5 * 10 ** 18);
    }

    function play() external {
        // Player transfers 1 token for playing
        require(token.balanceOf(msg.sender) >= 1 * 10 ** 18, "Not enough tokens");
        token.transfer(_owner, 1 * 10 ** 18);
    }
}
