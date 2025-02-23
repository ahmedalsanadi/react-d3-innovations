import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NetworkLink } from '../SmartNetworkNavigator/types';
import { useTemporalStore } from './store';
import { Rewind, FastForward, Play, Pause } from 'lucide-react';

interface TemporalForceGraphProps {
  initialNodes: NetworkNode[];
  initialLinks: NetworkLink[];
  width?: number;
  height?: number;
  timeSteps?: number;
}

export const TemporalForceGraph: React.FC<TemporalForceGraphProps> = ({
  initialNodes,
  initialLinks,
  width = 800,
  height = 600,
  timeSteps = 10
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { currentTimeStep, setTimeStep, addSnapshot, snapshots } = useTemporalStore();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Clear existing content
    svg.selectAll("*").remove();

    // Setup force simulation
    const simulation = d3.forceSimulation<NetworkNode>(initialNodes)
      .force("link", d3.forceLink<NetworkNode, NetworkLink>(initialLinks)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("temporal", (alpha: number) => {
        // Temporal force field effect
        initialNodes.forEach((node: any) => {
          const snapshot = snapshots[currentTimeStep]?.nodes.find(n => n.id === node.id);
          if (snapshot) {
            node.vx! += (snapshot.x! - node.x!) * alpha * 0.1;
            node.vy! += (snapshot.y! - node.y!) * alpha * 0.1;
          }
        });
      });

    // Create ghost trails group
    const trailsGroup = svg.append("g").attr("class", "trails");

    // Render links
    const link = svg.append("g")
      .selectAll(".link")
      .data(initialLinks)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));

    // Render nodes
    const node = svg.append("g")
      .selectAll<SVGGElement, NetworkNode>(".node")
      .data(initialNodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes
    node.append("circle")
      .attr("r", 20)
      .attr("fill", (d: NetworkNode) => d.color || "#69b3a2")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add labels
    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text((d: NetworkNode) => d.label);

    // Add prediction indicators
    node.append("circle")
      .attr("r", 25)
      .attr("fill", "none")
      .attr("stroke", "#00ff00")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.5)
      .attr("class", "prediction-indicator");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => {
          const source = typeof d.source === 'string' ? initialNodes.find(n => n.id === d.source) : d.source;
          return source?.x || 0;
        })
        .attr("y1", d => {
          const source = typeof d.source === 'string' ? initialNodes.find(n => n.id === d.source) : d.source;
          return source?.y || 0;
        })
        .attr("x2", d => {
          const target = typeof d.target === 'string' ? initialNodes.find(n => n.id === d.target) : d.target;
          return target?.x || 0;
        })
        .attr("y2", d => {
          const target = typeof d.target === 'string' ? initialNodes.find(n => n.id === d.target) : d.target;
          return target?.y || 0;
        });

      node
        .attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);

      // Update ghost trails
      initialNodes.forEach((node: NetworkNode) => {
        if (node.history && node.history.length > 1) {
          const trailData = node.history.slice(-timeSteps);
          const line = d3.line<NetworkNode>()
            .x(d => d.x || 0)
            .y(d => d.y || 0)
            .curve(d3.curveCatmullRom);

          trailsGroup.selectAll(`.trail-${node.id}`)
            .data([trailData])
            .join("path")
            .attr("class", `trail-${node.id}`)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "#ddd")
            .attr("stroke-width", 1)
            .attr("opacity", 0.5);
        }
      });

      // Save snapshot if simulation has stabilized
      if (simulation.alpha() < 0.1) {
        const snapshot = {
          nodes: initialNodes.map(node => ({ ...node })),
          links: initialLinks.map(link => ({ ...link }))
        };
        addSnapshot(snapshot);
      }
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, NetworkNode, any>, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, NetworkNode, any>, d: NetworkNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, NetworkNode, any>, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;

      // Record history
      if (!d.history) d.history = [];
      d.history.push({ ...d });

      // Limit history length
      if (d.history.length > timeSteps) {
        d.history.shift();
      }
    }

    // Cleanup
    return () => {
      simulation.stop();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initialNodes, initialLinks, currentTimeStep, snapshots]);

  // Animation controls
  useEffect(() => {
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (isPlaying && currentTime - lastTime > 1000) {
        setTimeStep((prev) => (prev + 1) % timeSteps);
        lastTime = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, timeSteps]);

  // Time control functions
  const handleRewind = () => {
    setTimeStep(Math.max(0, currentTimeStep - 1));
  };

  const handleFastForward = () => {
    setTimeStep(Math.min(snapshots.length - 1, currentTimeStep + 1));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white p-2 rounded-lg shadow-md">
        <button
          onClick={handleRewind}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="rewind"
        >
          <Rewind className="w-6 h-6" />
        </button>
        <button
          onClick={togglePlay}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label={isPlaying ? "pause" : "play"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={handleFastForward}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="fast forward"
        >
          <FastForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};