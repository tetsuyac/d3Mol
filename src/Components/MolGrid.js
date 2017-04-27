import React, {Component} from 'react'
import MolGridContainer from 'react-grid-layout'
import D3Mol from './D3Mol'
//import gridStyle from 'react-grid-layout/css/styles.css'
//import resizableStyle from 'react-resizable/css/styles.css'
import molGridStyle from './MolGrid.css'

export default class MolGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {resized:false}
    this.layout = [
      {i: 'a', x:  0, y: 0, w: 4, h: 4, maxW: 4, maxH: 4, isResizable: false},
      {i: 'b', x:  4, y: 0, w: 2, h: 2, maxW: 4, maxH: 4, isResizable: false},
      {i: 'c', x:  6, y: 0, w: 3, h: 3, maxW: 4, maxH: 4, isResizable: false},
      {i: 'd', x:  4, y: 2, w: 1, h: 1, maxW: 4, maxH: 4, isResizable: false},
      {i: 'e', x:  0, y: 4, w: 5, h: 5, maxW: 5, maxH: 5, isResizable: false},
      {i: 'f', x:  5, y: 4, w: 12, h: 12, maxW: 12, maxH: 12, isResizable: false}
    ];
    this.resized = this.resized.bind(this)
    this.molGridStyle = molGridStyle
  }
  resized(flag) {
    this.setState({resized:flag})
  }

  render() {
    return (
      <MolGridContainer id="molGrid" className="layout" layout={this.layout} cols={12} rowHeight={100} width={1200}>
        <div className='molPane' key={'a'} id={'a'} ref='a'><D3Mol myId={'a'} resized={this.resized}></D3Mol></div>
        <div className='molPane' key={'b'} id={'b'} ref='b'><D3Mol myId={'b'} resized={this.resized}></D3Mol></div>
        <div className='molPane' key={'c'} id={'c'} ref='c'><D3Mol myId={'c'} resized={this.resized}></D3Mol></div>
        <div className='molPane' key={'d'} id={'d'} ref='d'><D3Mol myId={'d'} resized={this.resized}></D3Mol></div>
        <div className='molPane' key={'e'} id={'e'} ref='e'><D3Mol myId={'e'} resized={this.resized}></D3Mol></div>
        <div className='molPane' key={'f'} id={'f'} ref='f'><D3Mol myId={'f'} resized={this.resized}></D3Mol></div>
      </MolGridContainer>
    )
  }
}
