import React from 'react'
import CreateReactClass from 'create-react-class'
import MolSearchStyle from './MolSearch.css'

var MolSearch = CreateReactClass({
  getInitialState: function () {
    return {searchString: ''}
  },
  handleChange: function (e) {
    this.setState({searchString: e.target.value})
  },
  getDefaultProps() {
    return {
      libraries: [
        {name: 'Dinitrogen', usm: 'N#N'},
        {name: 'Methyl isocyanate (MIC)', usm: 'CN=C=O'},
        {name: 'Copper(II) sulfate', usm: '[Cu+2].[O-]S(=O)(=O)[O-]'},
        {name: 'Vanillin', usm: 'O=Cc1ccc(O)c(OC)c1OCc1cc(C=O)ccc1O'},
        {name: 'Melatonin(C13H16N2O2)', usm: 'CC(=O)NCCC1=CNc2c1cc(OC)cc2CC(=O)NCCc1c[nH]c2ccc(OC)cc12'},
        {name: 'Flavopereirin (C17H15N2)', usm: 'CCc(c1)ccc2[n+]1ccc3c2[nH]c4c3cccc4CCc1c[n+]2ccc3c4ccccc4[nH]c3c2cc1'},
        {name: 'Nicotine (C10H14N2)', usm: 'CN1CCC[C@H]1c2cccnc2'},
        {name: 'Oenanthotoxin (C17H22O2)', usm: 'CCC[C@@H](O)CC\C=C\C=C\C#CC#C\C=C\COCCC[C@@H](O)CC/C=C/C=C/C#CC#C/C=C/CO'},
        {name: 'Pyrethrin II (C22H28O5)', usm: 'COC(=O)/C(C)=C/C1C(C)(C)[C@H]1C(=O)O[C@H]2CC(=O)C(=C2C)C/C=C/C=C'},
        {name: 'Aflatoxin B1 (C17H12O6)', usm: 'O1C=C[C@H]([C@H]1O2)c3c2cc(OC)c4c3OC(=O)C5=C4CCC(=O)5'},
        {name: 'Glucose (glucopyranose) (C6H12O6)', usm: 'OC[C@@H](O1)[C@@H](O)[C@H](O)[C@@H](O)[C@@H](O)1'},
        {name: 'Bergenin (cuscutin) (a resin) (C14H16O9)', usm: 'OC[C@@H](O1)[C@@H](O)[C@H](O)[C@@H]2[C@@H]1c3c(O)c(OC)c(O)cc3C(=O)O2'},
        {name: 'A pheromone of the Californian scale insect', usm: 'CC(=O)OCCC(/C)=C\C[C@H](C(C)=C)CCC=C'},
        {name: '2S,5R-Chalcogran: a pheromone of the bark beetle Pityogenes chalcographus', usm: 'CC[C@H](O1)CC[C@@]12CCCO2'},
        {name: 'Alpha-thujone (C10H16O)', usm: 'CC(C)[C@@]12C[C@@H]1[C@@H](C)C(=O)C2'},
        {name: 'Thiamine (C12H17N4OS+)(vitamin B1)', usm: 'OCCc1c(C)[n+](cs1)Cc2cnc(C)nc2N'},
      ]
    }
  },
  render: function () {
    var libraries = this.props.libraries,
      searchString = this.state.searchString.trim().toLowerCase()
    if (searchString.length > 0) {
      libraries = libraries.filter(function (l) {
        return l.usm.toLowerCase().match(searchString)
      })
    }
    return <div id="molSearch">
      <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="Type here"/>
      <ul>{ libraries.map(function (l, i) {
        return <li key={i}>
          <b>[{this.nbsp(l.name)}]</b>&nbsp;{l.usm}
        </li>
      }, this)}</ul>
    </div>
  },
  nbsp: function (s) {
    return s.replace(/ /g, '&nmsp')
  }
})
export default MolSearch
