import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'

export default class D3Mol extends Component {
  constructor(props) {
    super(props)
    this.store = {myId: props.myId, graphReady:false}
    this.me = this
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  updateDimensions () {
    this.props.resized(true)
  }
  componentWillMount () {
  }

  componentWillUnmount () {
  }

  componentDidMount() {
//    var el = ReactDOM.findDOMNode(window.document.getElementById(this.props.myId))
//    el.addEventListener("resize", this.updateDimensions)
    this.getGraph(this.props)
  }

  componentWillUpdate(nextProps, nextState) {
    var el = ReactDOM.findDOMNode(window.document.getElementById(nextProps.myId))
    this.store["width"] = window.getComputedStyle(ReactDOM.findDOMNode(el)).getPropertyValue("width")
    this.store["height"] = window.getComputedStyle(ReactDOM.findDOMNode(el)).getPropertyValue("height")
  }

  componentDidUpdate(prevProps, prevState) {
  }

  getGraph(props) {
    var me = this.me, ct = 1
    fetch("graph.json")
      .then(response => response.json())
      .then(json => {
        var graph = putGraph()
        var td = setInterval(() => {
          if (!--ct) {
            clearInterval(td)
          }
          me.store["graph"] = graph.next().value
          me.store["graphReady"] = true
          me.forceUpdate()
          console.log("getGraph graphReady: " + me.props.myId)
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
      null
//      <ResizeDetector handleWidth handleHeight onResize={this.updateDimensions}/>
    )
  }

  renderLoading() {
    return <div className="status">Loading Graph Data...</div>
  }

  renderProcessing() {
    return <div className="status">Processing Graph Data...</div>
  }

  renderError() {
    return (
      <div>
        Uh oh: {this.props.error.message}
      </div>
    )
  }

  d3Mol() {
    var width = parseInt(this.store.width,10), height = parseInt(this.store.height,10)

    console.log(`width: ${width} height: ${height}`)

    var pane = Math.ceil(Math.min(width, height) / 4), draw = Math.ceil(pane / 4)
    var color = d3.scale.category20(), radius = d3.scale.sqrt().domain([0,pane]).range([0, draw])
    var sel = 'div[id="' + this.props.myId + '"]'

    console.log(`sel: ${sel}`)

    var svg = d3.select(sel).append('svg').attr('width', width).attr('height', height)

    var force = d3.layout.force().size([width, height]).charge(-400).linkDistance(function (d) {
        return radius(d.source.size) + radius(d.target.size) + 20
      })

    force.nodes(this.store.graph.nodes).links(this.store.graph.links).on('tick', tick).start()

    var link = svg.selectAll('.link').data(this.store.graph.links).enter().append('g').attr('class', 'link')

    link.append('line').style('stroke-width', function (d) {
      return (d.bond * 2 - 1) * 2 + 'px'
    })

    link.filter(function (d) {
      return d.bond > 1
    }).append('line').attr('class', 'separator')

    var node = svg.selectAll('.node').data(this.store.graph.nodes).enter().append('g').attr('class', 'node').call(force.drag)

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
  }
}
