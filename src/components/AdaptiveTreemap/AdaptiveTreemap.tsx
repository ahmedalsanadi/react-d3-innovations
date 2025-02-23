import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TreemapNode, TreemapHierarchyNode } from './types';
import { useTreemapStore } from './store';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface AdaptiveTreemapProps {
  data: TreemapNode;
  width: number;
  height: number;
}

export const AdaptiveTreemap: React.FC<AdaptiveTreemapProps> = ({
  data,
  width,
  height
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [focusNode, setFocusNode] = useState<TreemapNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { addToHistory, updateFocusZone } = useTreemapStore();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Clear existing content
    svg.selectAll("*").remove();

    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemap = d3.treemap<TreemapNode>()
      .size([width, height])
      .paddingOuter(8)
      .paddingTop(20)
      .paddingInner(4)
      .round(true);

    treemap(root as d3.HierarchyNode<TreemapNode>);

    const g = svg.append("g");

    const cell = g
      .selectAll<SVGGElement, TreemapHierarchyNode>("g")
      .data(root.leaves() as TreemapHierarchyNode[])
      .join("g")
      .attr("transform", d => `translate(${d.x0 || 0},${d.y0 || 0})`);

    cell.append("rect")
      .attr("width", d => ((d.x1 || 0) - (d.x0 || 0)))
      .attr("height", d => ((d.y1 || 0) - (d.y0 || 0)))
      .attr("fill", (_, i) => d3.interpolateViridis(i / root.leaves().length))
      .attr("opacity", d => d.depth === 0 ? 0 : 0.8)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    const contextMenu = d3.select("body")
      .append("div")
      .attr("class", "context-menu")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px")
      .style("border-radius", "5px");

    cell
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("stroke", "black")
          .style("stroke-width", 2);

        const [x, y] = d3.pointer(event);
        contextMenu
          .style("visibility", "visible")
          .style("left", `${x + (d.x1 || 0)}px`)
          .style("top", `${y + (d.y0 || 0)}px`)
          .html(`
            <div>
              <strong>${d.data.name}</strong><br/>
              Value: ${d.data.value}
            </div>
          `);
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("stroke", null)
          .style("stroke-width", null);
        
        contextMenu.style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        setFocusNode(d.data);
        addToHistory(d.data);
        updateFocusZone(d.data);

        const transitionName = "zoom";
        const transition = svg.transition(transitionName)
          .duration(750);

        g.transition(transitionName)
          .attr("transform", `translate(${width/2},${height/2})scale(4)translate(${-(d.x0 || 0)},${-(d.y0 || 0)})`);

        cell.transition(transitionName)
          .attr("transform", d => `translate(${d.x0 || 0},${d.y0 || 0})`)
          .select("rect")
          .attr("width", d => ((d.x1 || 0) - (d.x0 || 0)))
          .attr("height", d => ((d.y1 || 0) - (d.y0 || 0)));
      });

    // Add text labels
    cell.append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text(d => d.data.name)
      .attr("fill", "white")
      .style("font-size", "12px");

    // Add focus zone indicator
    if (focusNode) {
      const focusCell = cell.filter(d => d.data === focusNode);
      focusCell.append("rect")
        .attr("class", "focus-indicator")
        .attr("width", d => ((d.x1 || 0) - (d.x0 || 0)))
        .attr("height", d => ((d.y1 || 0) - (d.y0 || 0)))
        .attr("fill", "none")
        .attr("stroke", "#ff0")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");
    }

    // Apply zoom transformation
    svg.attr("transform", `scale(${zoomLevel})`);

    return () => {
      contextMenu.remove();
      svg.selectAll("*").remove();
    };
  }, [data, focusNode, width, height, zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          aria-label="zoom in"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          aria-label="zoom out"
        >
          <ZoomOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};