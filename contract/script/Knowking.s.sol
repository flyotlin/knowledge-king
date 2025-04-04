// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {KnowledgeKingToken} from "../src/Token.sol";
import {KnowledgeKingGame} from "../src/Knowking.sol";

contract CounterScript is Script {
    KnowledgeKingToken token;
    KnowledgeKingGame game;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        vm.stopBroadcast();
    }
}
