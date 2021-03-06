# d3Mol - React D3 molecule
```
    0.4.2  05/06 : molSeach init, ongoing
    0.4.1  05/03 : [mouse capture on graph sticks] fixed
    0.4    04/30 : window resize, Mol Specs panel init
    0.3    04/29 : mol pane resizable, hosting at guthub.io
    0.2    04/26 : mol graph responsive in pane
    0.1    04/24 : mol graphs in draggable panes
rev 0.init 04/18/2017: mol graph
```


[DEMO](https://tetsuyac.github.io/d3Mol)

## memo
1. **[pane drag]** *react-grid-layout* natively supports this feature.

1. **[graph responsivenes]** hand-made responsiveness is built in yet there
   may be a better way doing this. working on it.

1. **[pane resize]** *react-grid-layout* pane resize updates width/height
   attributes on corresponding dom but does not trigger dom resize
   event. this is ok to pre-set size of initial pane but a problem when
   making svg responsive over dynamically changed pane size.

   *react-resize-detector* is utilized to trigger resize event, though
   react object injection was necessary to make it work. other plug-ins
   found just did not work well with responsive svg dom drawing.

1. **[graph drag by select]** graph drag by mouse select was working in
   limited way where it went weird state when graph drag release by
   another select was made on other graph running in other pane. fixed.

1. **[window resize]** *react-grid-layout* Responsive is still in old way
   not supporting es6 class so, MolGrid.js is converted to es5 (createClass).

1. **[graph spec string input/load]** rev0.4 panel / search init

1. **[gradual grow of graph in steps]** not yet

1. **[composite graph from sub graph set]** not yet

1. **[property manager on graph / node]** not yet

1. **[property aggregation from sub graph set]** not yet

1. **[interactive graph build simulation]** not yet

1. **[output built graph spec string]** not yet

## steps to run
1. git clone https://github.com/tetsuyac/d3Mol.git d3Mol
1. cd d3Mol
1. npm install
1. npm start
1. visit http://localhost:3010 with local browser
1. have a fun!

## references
#### create-react-app
https://github.com/facebookincubator/create-react-app/blob/master/README.md#getting-started
#### Molecule
https://bl.ocks.org/mbostock/3037015
