import React, { Component } from 'react';   
import { Button } from 'react-bootstrap';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Election from './contracts/Election.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
    }
    
    window.addEventListener('load', function () {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try { 
           window.ethereum.enable().then(function() {
               // User has allowed account access to DApp...
               //alert('You can now use the DApp !');
           });
        } catch(e) {
           // User has denied account access to DApp...
           alert('You have denied access to DApp !');
        }
     }
     // Legacy DApp Browsers
     else if (window.web3) {
         const web3 = new Web3(window.web3.currentProvider);
     }
     // Non-DApp Browsers
     else {
         alert('You have to install MetaMask !');
    }  
    });

    this.web3 = new Web3(window.web3.currentProvider)
    this.election = TruffleContract(Election)
    this.election.setProvider(window.web3.currentProvider)

    this.castVote = this.castVote.bind(this)
    this.watchEvents = this.watchEvents.bind(this)

  }

  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.election.deployed().then((electionInstance) => {
        this.electionInstance = electionInstance
        this.watchEvents()
        this.electionInstance.candidatesCount().then((candidatesCount) => {
          for (var i = 1; i <= candidatesCount; i++) {
            this.electionInstance.candidates(i).then((candidate) => {
              const candidates = [...this.state.candidates]
              candidates.push({
                id: candidate[0],
                name: candidate[1],
                voteCount: candidate[2]
              });
              this.setState({ candidates: candidates })
            });
          }
        })
        this.electionInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted, loading: false })
        })
      })
    })
  }

  watchEvents() {
    this.electionInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({ voting: false })
    })
  }

  castVote(candidateId) {
    this.setState({ voting: true })
    this.electionInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
    )
  }

  render() {
    return (
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <br /><br /><br />
          <h1>Decentralised Voting</h1>
          <br/>
          { this.state.loading || this.state.voting
            ? <p class='text-center'>Loading...</p>
            : <Content
                account={this.state.account}
                candidates={this.state.candidates}
                hasVoted={this.state.hasVoted}
                castVote={this.castVote} />
          }
        </div>
      </div>
    )
  }
}
 
export default Home;