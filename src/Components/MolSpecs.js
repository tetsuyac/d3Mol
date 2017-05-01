import React from 'react'
import Styles from './MolSpecs.css'

var styles = Styles
var MolSpecs = React.createClass({
  getInitialState: function () {
    return {total: 0}
  },
  addTotal: function (weight) {
    this.setState({total: this.state.total + weight})
  },
  render: function () {
    var self = this
    var specs = this.props.items.map(function (s, i) {
      return <Service key={i} name={s.name} weight={s.weight} active={s.active} addTotal={self.addTotal}/>
    })
    return <div id="molSpec" styles="{styles}">
      <h1>Mol Specs</h1>
      <div id="specs">
        {specs}
        <p id="total">Total
          <b>{this.state.total.toFixed()}</b>
        </p>
      </div>
    </div>
  }
})

var Service = React.createClass({
  getInitialState: function () {
    return {active: false}
  },
  clickHandler: function () {
    var active = !this.state.active
    this.setState({active: active})
    this.props.addTotal(active ? this.props.weight : -this.props.weight)
  },
  render: function () {
    return <p className={ this.state.active ? 'active' : '' } onClick={this.clickHandler}>
      {this.props.name}
      <b>{this.props.weight.toFixed()}</b>
    </p>
  }
})
export default MolSpecs
