import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import ResizeDetector from 'react-resize-detector'
import D3MolOutsideEventContainer from 'react-outside-event'
import d3MolStyle from './D3Mol.css'

const EventListenerMode = {capture: false}

class D3Mol extends Component {
  constructor(props) {
    super(props)
    this.store = {myId: props.myId, me: null, svg: null, graphReady: false, molRim: undefined, isDragOn: false}
    this.getStore = () => {
      return Object.assign({}, this.store)
    }
    this.me = this
    this.d3MolStyle = d3MolStyle
  }

  onOutsideEvent = (event) => {
    if (event.type === 'mousedown') {
      console.log('mousedown')
    } else if (event.type === 'mouseup') {
      console.log('mousep')
    }
  }
  handleResize = (width, height) => { // dom native scheme
    if (typeof this.store !== 'undefined') {
      if (typeof this.store.molRim !== 'undefined') {
        this.store.width = width
        this.store.height = height
        this.forceUpdate()
      }
    }
  }

  callGetStore = () => {
    return this.getStore()
  }

  handleResiseWrapper = (width, height) => {
    this.handleResize(width, height)
  }

  mousedownListener = (e) => {
    if (this.isGraphElement(e)) {
      this.store.me.focus()
      this.captureMouseEvents(e)
      console.log('down')
    }
  }

  captureMouseEvents(e) {
    this.preventGlobalMouseEvents()
    this.store.me.addEventListener('mousemove', this.mousemoveListener, EventListenerMode)
    document.addEventListener('mouseup', this.mouseupListener, EventListenerMode)
    e.preventDefault()
    e.stopPropagation()
  }

  mousemoveListener = (e) => {
    e.stopPropagation()
    // do whatever is needed while the user is moving the cursor around
    console.log('move')
  }

  mouseupListener = (e) => {
//    if (this.isGraphElement(e)) {
    this.store.me.blur()
    this.releaseMouseEvents(e)
    console.log('up')
//    }
  }

  releaseMouseEvents(e) {
    this.restoreGlobalMouseEvents()
    this.store.me.removeEventListener('mousemove', this.mousemoveListener, EventListenerMode)
    document.removeEventListener('mouseup', this.mouseupListener, EventListenerMode)
    e.stopPropagation()
  }

  isGraphElement(e) {
    var el = e.target.tagName
    return el === 'circle'
  }

  preventGlobalMouseEvents() {
    document.body.style['pointer-events'] = 'none'
  }

  restoreGlobalMouseEvents() {
    document.body.style['pointer-events'] = 'auto'
  }

  componentDidMount() {
    this.store.me = ReactDOM.findDOMNode(this)
    this.store.molRim = document.getElementById(this.store.myId)
    this.store.molPane = document.querySelector(`div[id=${this.props.myId}]`).querySelector('.molPane')
    this.store.me.addEventListener('mousedown', e => this.mousedownListener(e))
    this.getGraph(this.props)
  }

  componentWillUpdate(nextProps, nextState) {
    var rt = ReactDOM.findDOMNode(window.document.getElementById('root')),
      el = ReactDOM.findDOMNode(window.document.getElementById(nextProps.myId))
    this.store['width'] = el.clientWidth
    this.store['height'] = el.clientHeight
    this.store['ratio'] = Math.min(el.clientWidth / rt.clientWidth, el.clientHeight / rt.clientHeight)
  }

  componentWillMount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
  }

  getGraph(props) {
    var me = this.me, ct = 1
    fetch('graph.json')
      .then(response => response.json())
      .then(json => {
        var graph = putGraph()
        var td = setInterval(() => {
          if (!--ct) {
            clearInterval(td)
          }
          me.store['graph'] = graph.next().value
          me.store['graphReady'] = true
          me.forceUpdate()
          console.log('getGraph graphReady: ' + me.props.myId)
        }, 2000)

        function* putGraph() {
          yield json.graphs[0]
//          yield json.graphs[1]
        }
      })
  }

  render() {
    if (typeof this.store === 'object') {
      if (typeof this.store.graphReady !== 'undefined') {
        if (this.store.graphReady) {
          this.d3Mol()
        }
      }
    }
    return (
      <div className='molPeri'>
        <div className='molPane'/>
        <ResizeDetector handleWidth handleHeight onResize={this.handleResiseWrapper}/>
      </div>
    )
  }

  renderLoading() {
    return <div className='status'>Loading Graph Data...</div>
  }

  renderProcessing() {
    return <div className='status'>Processing Graph Data...</div>
  }

  renderError() {
    return (
      <div>
        Uh oh: {this.props.error.message}
      </div>
    )
  }

  d3Mol() {
    var width = parseInt(this.store.width, 10), height = parseInt(this.store.height, 10),
      _radix = 10, _range = 24, _ratio = this.store.ratio,
      color = d3.scale.category20()

    console.log(`width: ${width} height: ${height}`)

    if (this.store.svg) {
      this.store.molPane.removeChild(this.store.svg[0][0])
    }
    this.store.svg = d3.select(this.store.molPane).append('svg')
    this.store.svg.attr('width', '100%').attr('height', '100%')

    var force = d3.layout.force().size([width, height]).charge(Math.ceil(-1000 * _ratio)).linkDistance(function (d) {
      return radius(d.source.size) + radius(d.target.size)
    });

    var o = adjustWH({width, height})
    width = o.width
    height = o.height

    function adjustWH(o) {
//      o.width < o.height ?
      return o
    }

    force.nodes(this.store.graph.nodes).links(this.store.graph.links).on('tick', tick).start()

    var link = this.store.svg.selectAll('.link').data(this.store.graph.links).enter().append('g').attr('class', 'link')

    link.append('line').style('stroke-width', function (d) {
      return (d.bond * 2 - 1) * 2 + 'px'
    })

    link.filter(function (d) {
      return d.bond > 1
    }).append('line').attr('class', 'separator')

    var node = this.store.svg.selectAll('.node').data(this.store.graph.nodes).enter().append('g').attr('class', 'node').call(force.drag)

    node.append('circle').attr('r', function (d) {
      return radius(d.size)
    }).style('fill', function (d) {
      return color(d.atom)
    })
    node.append('text').attr('dy', '.35em').attr('text-anchor', 'middle').text(function (d) {
      return d.atom
    })

    function tick() {
      link.selectAll('line').attr('x1', function (d) {
        return d.source.x
      }).attr('y1', function (d) {
        return d.source.y
      }).attr('x2', function (d) {
        return d.target.x
      }).attr('y2', function (d) {
        return d.target.y
      })
      node.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    }

    function radius(size) { // refined ratio modulation
      return (d3.scale.sqrt().domain([0, 12 * _radix]).range([0, _range]))(Math.ceil(size * _radix * _ratio))
    }

  }
}
export default D3MolOutsideEventContainer(D3Mol, ['mousedown', 'mouseup'])