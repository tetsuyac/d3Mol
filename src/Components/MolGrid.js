import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import MolGridContainer from 'react-grid-layout'
import D3Mol from './D3Mol'
import gridStyle from 'react-grid-layout/css/styles.css'
import resizableStyle from 'react-resizable/css/styles.css'
import molGridStyle from './MolGrid.css'

export default class MolGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.layout = [
      {i: 'a', x: 0, y: 0, w: 4, h: 4, maxW: 4, maxH: 4},
      {i: 'b', x: 4, y: 0, w: 2, h: 2, maxW: 4, maxH: 4},
      {i: 'c', x: 6, y: 0, w: 3, h: 3, maxW: 4, maxH: 4},
      {i: 'd', x: 4, y: 2, w: 1, h: 1, maxW: 4, maxH: 4},
      {i: 'e', x: 0, y: 4, w: 5, h: 5, maxW: 5, maxH: 5},
      {i: 'f', x: 5, y: 4, w: 12, h: 12, maxW: 12, maxH: 12}
    ]
    this.breakpoints = {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}
    this.cols =        {lg:   12, md:  10, sm:   6, xs:   4, xxs: 2}

    this.gridStyle = gridStyle
    this.resizableStyle = resizableStyle
    this.molGridStyle = molGridStyle
  }

  componentDidMount() {
    this.setState({molGrid: ReactDOM.findDOMNode(this)})
  }

  render() {
    return (
      <div id="molGrid">
        <MolGridContainer className="layout" layout={this.layout} cols={12} rowHeight={100} width={1200}>
          <div key={'a'} id={'a'}><D3Mol myId={'a'} molGrid={this.state.molGrid}></D3Mol></div>
          <div key={'b'} id={'b'}><D3Mol myId={'b'} molGrid={this.state.molGrid}></D3Mol></div>
          <div key={'c'} id={'c'}><D3Mol myId={'c'} molGrid={this.state.molGrid}></D3Mol></div>
          <div key={'d'} id={'d'}><D3Mol myId={'d'} molGrid={this.state.molGrid}></D3Mol></div>
          <div key={'e'} id={'e'}><D3Mol myId={'e'} molGrid={this.state.molGrid}></D3Mol></div>
          <div key={'f'} id={'f'}><D3Mol myId={'f'} molGrid={this.state.molGrid}></D3Mol></div>
        </MolGridContainer>
      </div>
    )
  }
}
