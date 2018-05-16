pragma solidity ^0.4.17;

contract Election {

    //candidate model
    struct Candidate {
      uint id;
      string name;
      uint voteCount;
    }

    //store candidate data
    mapping(uint => Candidate) public candidates;

    //store voter data
    mapping(address => bool) public voters;

    uint public candidatesCount;

    //contructor
    function Election () public {
      addCandidate("John Doe");
      addCandidate("Another John Doe");
    }

    function addCandidate (string _name) private {
      candidatesCount++;
      candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
      //check if the address has voted before
      require(!voters[msg.sender]);

      //check if the candidate is valid
      require(_candidateId > 0 && _candidateId <= candidatesCount);

      //mark the user as voted
      voters[msg.sender] = true;

      //update voteCount
      candidates[_candidateId].voteCount++;
    }

}
