import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state ={
    manager:'',
    players:[],
    balance:'',
    value:'',
    message:''
  };
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players= await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players,balance});
  }
  onSubmit= async (event)=>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    
    this.setState({message:'waiting on transaction success......'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message:'You have been entered!!!'});
  };
  render(){
    //console.log(web3.version);
    return (
      <div>
        <h2>lottery Contract</h2>
        <p>this contract is managed by {this.state.manager},
        there are currently {this.state.players.length} people entered into the game
        competeing for {web3.utils.fromWei(this.state.balance,'ether')} ether</p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>want to gamble</h4>
          <div>
            <label>amount of ether you want to gamble</label>
            <input 
            value={this.state.value} 
            onChange={event => this.setState({value:event.target.value})}
            />

          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
  
}

export default App;
