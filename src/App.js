import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import Fetch from 'react-fetch'
import D3Mol from './Components/D3Mol'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <Fetch url="graph.json">
        <D3Mol/>
      </Fetch>
    )
  }
}

ReactDOM.render(
  <App/>, document.getElementById('root')
);
