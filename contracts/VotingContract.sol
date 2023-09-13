// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

contract Voting {

    address public admin;
    uint startTime;
    uint endTime;

    struct Voters {
        string name;
        string votingCenter;
        bool voted;
    }

    Voters voter;

    struct Candidate {
        address addr;
        string name;
        string party;
        string office;
    }

    Candidate[] candidate;

    mapping(address => bool) public isQualified;
    mapping(address => mapping(uint id => Voters)) Voter;
    mapping(address => uint) public candidateVote;

    constructor() {
        admin = msg.sender;
        startTime = block.number;
        endTime = block.timestamp + 604800;
    }

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }
    
    uint id;
    uint _id;

    function registerVoter(address _voter, string calldata _name, string calldata _votingCenter) public returns(uint) {
        require(!isQualified[_voter], "Already qualified, can't register");
        isQualified[_voter] = true;
        id += 1;
        Voter[_voter][id].name = _name;
        Voter[_voter][id].votingCenter = _votingCenter;
        Voter[_voter][id].voted = false;
        return id;
    } 

    function registerCandidate(address _addr, string calldata _name, string calldata _party, string calldata _office) public onlyAdmin {
        _id += 1;
        require(candidate[_id].addr == _addr, "Already a registered candidate");
        candidate.push(Candidate({
            addr: _addr,
            name: _name,
            party: _party,
            office: _office
        }));
    }

    function Vote(uint _Id, address _addr) public returns(bool success){
        require(block.timestamp <= endTime, "Voting ended");
        require(!isQualified[msg.sender] == false, "Only Qualified voters can vote");
        require(Voter[msg.sender][_Id].voted, "Already voted");
        if(candidate[_Id].addr == _addr){
            candidateVote[_addr] += 1;
            Voter[msg.sender][_Id].voted = true;
        } else{
            revert();
        }
        success = true; 
    }

    function viewVotes(address _candidate) external view onlyAdmin returns(uint) {
        if(block.timestamp > endTime){
            return candidateVote[_candidate];
        }
    }

}