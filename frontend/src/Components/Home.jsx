import React, { Component } from 'react';   
import { Button } from 'react-bootstrap';
import Web3 from 'web3'
import { CONTRACT_ABI, CONTRACT_ADDRESS, INFURA_PROVIDER, SENDER_ADDRESS, SENDER_PVT_KEY } from './constants'
import CandidateTable from './CandidateTable'
var Tx = require('ethereumjs-tx');

class Home extends Component {
    state = { 
        account : "",
        loading : true,
        candidatesCount : "",
        candidateList : []
     }

    fetchBlockchainData = async() => {
      const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER));
      var getNonce = await web3.eth.getTransactionCount(SENDER_ADDRESS, 'pending');
      var contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, { from: SENDER_ADDRESS });
      const payload = contract.methods.createCandidate(this.state.name, this.state.college, this.state.addr, this.state.phone).encodeABI();
      // prepare transaction
      var rawTx = {
          nonce: getNonce,
          gasPrice: web3.utils.toHex('10000000000'),
          gasLimit: web3.utils.toHex('3000000'),
          to: CONTRACT_ADDRESS,
          value: '0x0',
          data: payload
      };

      console.log(rawTx);
      var tx = new Tx(rawTx);
      var privKey = Buffer.from(SENDER_PVT_KEY, 'hex');
      tx.sign(privKey);

      var serializedTx = tx.serialize();

      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
          if (!err) {
              console.log(hash);
          } else {
              console.log(err)
          }
      })
    }

    async componentDidMount() {
        this.fetchBlockchainData()
    }

    render() { 
        return (
        <React.Fragment>
            <div className="container">
            <div className="jumbotron">
                <h1 className="display-4">Home</h1>
                <p>Active Account : {this.state.account}</p>
                <button type="button" class="btn btn-primary" onClick={() => {
              window.location = '/add';
            }}>Add New Student</button>
            </div>

            <div className="row">
                {this.state && !this.state.loading && (
                <div className="col-md-6">
                {this.state.candidateList.map(c => (
                  <ul key={c.uid}>
                    <CandidateTable c={c} />
                  </ul>
                ))}
              </div>
              )}
            </div>

            </div>

        </React.Fragment>
        )
    }
}
 
export default Home;