import { useState } from 'react';
import { SmartNetworkNavigator } from './components/SmartNetworkNavigator/SmartNetworkNavigator';
import { TemporalForceGraph } from './components/TemporalForceGraph/TemporalForceGraph';
import { AdaptiveTreemap } from './components/AdaptiveTreemap/AdaptiveTreemap';
import type { NetworkNode, NetworkLink } from './components/SmartNetworkNavigator/types';
import type { TreemapNode } from './components/AdaptiveTreemap/types';

const sampleNodes: NetworkNode[] = [
  { id: "1", name: "Node 1", x: 100, y: 100 },
  { id: "2", name: "Node 2", x: 200, y: 200 },
  { id: "3", name: "Node 3", x: 300, y: 150 }
];

const sampleLinks: NetworkLink[] = [
  { source: "1", target: "2", value: 1 },
  { source: "2", target: "3", value: 2 }
];

const treemapData: TreemapNode = {
  name: "Root",
  value: 100,
  children: [
    {
      name: "Group A",
      value: 60,
      children: [
        { name: "A1", value: 30 },
        { name: "A2", value: 30 }
      ]
    },
    {
      name: "Group B",
      value: 40,
      children: [
        { name: "B1", value: 20 },
        { name: "B2", value: 20 }
      ]
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'network' | 'temporal' | 'treemap'>('network');

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'network' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('network')}
        >
          Smart Network
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'temporal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('temporal')}
        >
          Temporal Force
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'treemap' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('treemap')}
        >
          Adaptive Treemap
        </button>
      </div>

      <div className="border rounded p-4">
        {activeTab === 'network' && (
          <SmartNetworkNavigator
            nodes={sampleNodes}
            links={sampleLinks}
            width={800}
            height={600}
          />
        )}

        {activeTab === 'temporal' && (
          <TemporalForceGraph
            initialNodes={sampleNodes}
            initialLinks={sampleLinks}
            width={800}
            height={600}
          />
        )}

        {activeTab === 'treemap' && (
          <AdaptiveTreemap
            data={treemapData}
            width={800}
            height={600}
          />
        )}
      </div>
    </div>
  );
}