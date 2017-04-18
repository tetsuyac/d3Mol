import React, {Component} from 'react'
import d3 from 'd3'

export default class D3Mol extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    if (typeof this.props.graph !== 'undefined' &&
      typeof this.props.graph.nodes !== 'undefined' &&
      typeof this.props.graph.links !== 'undefined') {
      return this.loadCompleted()
    } else if (typeof this.props.nodes !== 'undefined' &&
      typeof this.props.links !== 'undefined') {
      this.setState({graph: this.props.graph})
      return this.renderProcessing()
    }
    return this.renderLoading()
  }

  renderLoading() {
    return null
//    return <div className="status">Loading Graph Data...</div>
  }

  renderProcessing() {
    return null
//    return <div className="status">Processing Graph Data...</div>
  }

  loadCompleted() {
    this.d3Mol()
    return null
  }

  renderError() {
    return (
      <div>
        Uh oh: {this.props.error.message}
      </div>
    )
  }

  d3Mol() {
    var width = 960,
      height = 500;
    var color = d3.scale.category20();
    var radius = d3.scale.sqrt()
      .range([0, 6]);
    var svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);
    var force = d3.layout.force()
      .size([width, height])
      .charge(-400)
      .linkDistance(function (d) {
        return radius(d.source.size) + radius(d.target.size) + 20;
      });

    force
      .nodes(this.props.graph.nodes)
      .links(this.props.graph.links)
      .on('tick', tick)
      .start();

    var link = svg.selectAll('.link')
      .data(this.props.graph.links)
      .enter().append('g')
      .attr('class', 'link');

    link.append('line')
      .style('stroke-width', function (d) {
        return (d.bond * 2 - 1) * 2 + 'px';
      });

    link.filter(function (d) {
      return d.bond > 1;
    }).append('line')
      .attr('class', 'separator');

    var node = svg.selectAll('.node')
      .data(this.props.graph.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(force.drag);

    node.append('circle')
      .attr('r', function (d) {
        return radius(d.size);
      })
      .style('fill', function (d) {
        return color(d.atom);
      });

    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(function (d) {
        return d.atom;
      });

    function tick() {
      link.selectAll('line')
        .attr('x1', function (d) {
          return d.source.x;
        })
        .attr('y1', function (d) {
          return d.source.y;
        })
        .attr('x2', function (d) {
          return d.target.x;
        })
        .attr('y2', function (d) {
          return d.target.y;
        });

      node.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }
}
