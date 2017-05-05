import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import ResizeDetector from 'react-resize-detector'
import MolStyle from './Mol.css'

const EventListenerMode = {capture: false}

export default class D3Mol extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isManagingFocus: false,
    }
    this.store = {myId: props.myId, me: null, svg: null, graphReady: false, molRim: undefined, isDragOn: false}
    this.me = this
    this.MolStyle = MolStyle
  }

  onOutsideEvent = (event) => {
    if (event.type === 'mousedown') {
      console.log('down o-ev')
    } else if (event.type === 'mouseup') {
      console.log('up   o-ev')
    }
  }
  handleResize = (width, height) => { // dom native scheme
    var store = this.store
    if (typeof store !== 'undefined') {
      if (typeof store.molRim !== 'undefined') {
        store.width = width
        store.height = height
        this.forceUpdate()
      }
    }
  }

  handleResiseWrapper = (width, height) => {
    this.handleResize(width, height)
  }

  mousedownListener = (e) => {
    var store = this.store
    if (this.isGraphElement(e)) {
      store.me.focus()
      store.me.addEventListener('mouseup', this.mouseupListener, EventListenerMode)
      e.preventDefault()
      e.stopPropagation()
      console.log('down native')
    }
  }

  mouseupListener = (e) => {
    var store = this.store
    store.me.blur()
    store.me.removeEventListener('mouseup', this.mouseupListener, EventListenerMode)
    console.log('up   native')
  }

  isGraphElement(e) {
    var el = e.target.tagName
    return el === 'circle'
  }

  componentDidMount() {
    var store = this.store
    store.me = ReactDOM.findDOMNode(this)
    store.molRim = document.getElementById(store.myId)
    store.molPane = document.querySelector(`div[id=${this.props.myId}]`).querySelector('.molPane')
    store.me.addEventListener('mousedown', e => this.mousedownListener(e))
    this.getGraph(this.props)
  }

  componentWillUpdate(nextProps, nextState) {
    var store = this.store
    var rt = ReactDOM.findDOMNode(window.document.getElementById('root')),
      el = ReactDOM.findDOMNode(window.document.getElementById(nextProps.myId))
    store['width'] = el.clientWidth
    store['height'] = el.clientHeight
    store['ratio'] = Math.min(el.clientWidth / rt.clientWidth, el.clientHeight / rt.clientHeight)
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
    var store = this.store
    if (typeof store === 'object') {
      if (typeof store.graphReady !== 'undefined') {
        if (store.graphReady) {
          this.d3Mol()
        }
      }
    }
    return (
      <div className='molPeri'>
        <div
          className='molPane'/>
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
    var store = this.store, width = parseInt(store.width, 10), height = parseInt(store.height, 10),
      _radix = 10, _range = 24, _ratio = store.ratio,
      color = d3.scale.category20()

    console.log(`width: ${width} height: ${height}`)

    if (store.svg) {
      store.molPane.removeChild(store.svg[0][0])
    }
    store.svg = d3.select(store.molPane).append('svg')
    store.svg.attr('width', width).attr('height', height)

    var force = d3.layout.force().size([width, height]).charge(Math.ceil(-1000 * _ratio)).linkDistance(function (d) {
      return radius(d.source.size) + radius(d.target.size)
    });

    force.nodes(store.graph.nodes).links(store.graph.links).on('tick', tick).start()

    var link = store.svg.selectAll('.link').data(store.graph.links).enter().append('g').attr('class', 'link')

    link.append('line').style('stroke-width', function (d) {
      return (d.bond * 2 - 1) * 2 + 'px'
    })

    link.filter(function (d) {
      return d.bond > 1
    }).append('line').attr('class', 'separator')

    var node = store.svg.selectAll('.node').data(store.graph.nodes).enter().append('g').attr('class', 'node').call(force.drag)

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
