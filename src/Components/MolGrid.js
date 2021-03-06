import React from 'react'
import CreateReactClass from 'create-react-class'
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin'
import {Responsive} from 'react-grid-layout'
var WidthProvider = require('react-grid-layout').WidthProvider
var ResponsiveReactGridLayout = WidthProvider(Responsive)
import Mol from './Mol'
import gridStyle from 'react-grid-layout/css/styles.css'
import resizableStyle from 'react-resizable/css/styles.css'
import molGridStyle from './MolGrid.css'

const originalLayouts = getFromLS('layouts') || {};

var MolGrid = CreateReactClass({
  mixins: [PureRenderMixin],
  gridStyle: gridStyle,
  resizableStyle: resizableStyle,
  molGridStyle: molGridStyle,
  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      rowHeight: 100,
      onLayoutChange: function () {
      }
    }
  },

  getInitialState() {
    return {
      layouts: JSON.parse(JSON.stringify(originalLayouts))
    };
  },

  resetLayout() {
    this.setState({layouts: {}});
  },

  onLayoutChange(layout, layouts) {
    saveToLS('layouts', layouts);
    this.setState({layouts});
    this.props.onLayoutChange(layout, layouts);
  },

  render() {
    return (
      <div id="molGrid">
        <button onClick={this.resetLayout}>Reset Layout</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onLayoutChange={this.onLayoutChange}>
          <div key={'a'} id={'a'} data-grid={{i: 'a', x: 0, y: 0, w: 1, h: 1}}><Mol myId={'a'}></Mol></div>
          <div key={'b'} id={'b'} data-grid={{i: 'b', x: 1, y: 1, w: 1, h: 1}}><Mol myId={'b'}></Mol></div>
          <div key={'c'} id={'c'} data-grid={{i: 'c', x: 2, y: 0, w: 1, h: 1}}><Mol myId={'c'}></Mol></div>
          <div key={'d'} id={'d'} data-grid={{i: 'd', x: 3, y: 1, w: 2, h: 1}}><Mol myId={'d'}></Mol></div>
          <div key={'e'} id={'e'} data-grid={{i: 'e', x: 0, y: 2, w: 2, h: 2}}><Mol myId={'e'}></Mol></div>
          <div key={'f'} id={'f'} data-grid={{i: 'f', x: 2, y: 2, w: 2, h: 2}}><Mol myId={'f'}></Mol></div>
        </ResponsiveReactGridLayout>
      </div>
    )
  }
})
export default MolGrid

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8')) || {};
    } catch (e) {/*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem('rgl-8', JSON.stringify({
      [key]: value
    }));
  }
}
