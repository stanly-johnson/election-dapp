pragma solidity ^0.4.17;

contract Election {

    //candidate model
    struct Candidate {
      uint id;
      string name;
      uint voteCount;
    }

    mapping(uint => Candidate) public candidates;

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

}
