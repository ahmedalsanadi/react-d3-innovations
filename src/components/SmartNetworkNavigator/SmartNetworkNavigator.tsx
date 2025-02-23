import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNetworkStore } from './store';
import { NetworkNode, NetworkLink } from './types';

interface SmartNetworkNavigatorProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width?: number;
  height?: number;
  onNodeClick?: (node: NetworkNode) => void;
}

export const SmartNetworkNavigator: React.FC<SmartNetworkNavigatorProps> = ({
  nodes,
  links,
  width = 800,
  height = 600,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { setCurrentNode, addToHistory } = useNetworkStore();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation<NetworkNode>(nodes)
      .force("link", d3.forceLink<NetworkNode, NetworkLink>(links)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const g = svg.append("g");

    const link = g.selectAll<SVGLineElement, NetworkLink>(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = g.selectAll<SVGGElement, NetworkNode>(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 10)
      .attr("fill", "#69b3a2");

    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(d => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => {
          const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
          return source?.x || 0;
        })
        .attr("y1", d => {
          const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
          return source?.y || 0;
        })
        .attr("x2", d => {
          const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
          return target?.x || 0;
        })
        .attr("y2", d => {
          const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
          return target?.y || 0;
        });

      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });

    function dragstarted(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragged(event: any, d: NetworkNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;

      // Record history
      if (!d.history) d.history = [];
      d.history.push({ ...d });
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height} className="w-full h-full" />
  );
};