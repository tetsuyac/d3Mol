import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import MolGrid from './Components/MolGrid'
import MolSpec from './Components/MolSpecs'
import './App.css';

export default class App extends Component {
  services = [
    {name: 'spec1', weight: 300},
    {name: 'spec2', weight: 400},
    {name: 'spec3', weight: 250},
    {name: 'spec4', weight: 220}
  ]
  render() {
    return (
      <div id="d3Mol">
        <MolGrid/>
        <MolSpec items={this.services}/>
      </div>
    )
  }
}

ReactDOM.render(
  <App/>, document.getElementById('root')
);
