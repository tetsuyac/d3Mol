import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import MolGrid from './Components/MolGrid'
import './App.css';

export default class App extends Component {
  render() {
    return <MolGrid/>
  }
}

ReactDOM.render(
  <App/>, document.getElementById('root')
);
