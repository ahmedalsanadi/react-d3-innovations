# React D3 Innovations

A groundbreaking React library for advanced data visualization, combining the power of D3.js with innovative interaction patterns and smart features.

## Features

### 1. Smart Network Navigator
- Interactive node visualization with force-directed layout
- Ghost trails showing historical movements
- Preview windows on hover
- Smart dragging with physics simulation
- State management for navigation history

### 2. Temporal Force Graph
- Time-based interactions with rewind/fast-forward controls
- Temporal force fields affecting node positioning
- Ghost trails for historical movement patterns
- Predictive node positioning
- State management for temporal snapshots

### 3. Adaptive Treemap Explorer
- Self-organizing layouts
- Focus zones that redistribute space
- Context bubbles with additional insights
- Morphing transitions between structures
- Smart zooming capabilities

## Installation

```bash
npm install react-d3-innovations
```

## Usage

```tsx
import { 
  SmartNetworkNavigator, 
  TemporalForceGraph, 
  AdaptiveTreemap 
} from 'react-d3-innovations';

// Smart Network Navigator
const MyNetwork = () => {
  const nodes = [
    { id: '1', name: 'Node 1' },
    { id: '2', name: 'Node 2' }
  ];
  
  const links = [
    { source: '1', target: '2', value: 1 }
  ];

  return (
    <SmartNetworkNavigator
      nodes={nodes}
      links={links}
      width={800}
      height={400}
      onNodeClick={(node) => console.log('Clicked node:', node)}
    />
  );
};

// Temporal Force Graph
const MyTemporalGraph = () => {
  const nodes = [
    { 
      id: '1', 
      name: 'Node 1',
      history: [
        { x: 100, y: 100, timestamp: 1 },
        { x: 200, y: 200, timestamp: 2 }
      ]
    }
  ];

  return (
    <TemporalForceGraph
      initialNodes={nodes}
      initialLinks={[]}
      width={800}
      height={400}
    />
  );
};

// Adaptive Treemap
const MyTreemap = () => {
  const data = {
    name: 'root',
    children: [
      { name: 'A', value: 100 },
      { name: 'B', value: 200 }
    ]
  };

  return (
    <AdaptiveTreemap
      data={data}
      width={800}
      height={400}
    />
  );
};
```

## API Reference

### SmartNetworkNavigator Props

| Prop | Type | Description |
|------|------|-------------|
| nodes | NetworkNode[] | Array of nodes with { id, name, x?, y? } |
| links | NetworkLink[] | Array of links with { source, target, value } |
| width | number | Width of the visualization |
| height | number | Height of the visualization |
| onNodeClick | (node: NetworkNode) => void | Callback when a node is clicked |

### TemporalForceGraph Props

| Prop | Type | Description |
|------|------|-------------|
| initialNodes | NetworkNode[] | Initial array of nodes with history |
| initialLinks | NetworkLink[] | Initial array of links |
| width | number | Width of the visualization |
| height | number | Height of the visualization |

### AdaptiveTreemap Props

| Prop | Type | Description |
|------|------|-------------|
| data | TreemapNode | Hierarchical data structure |
| width | number | Width of the visualization |
| height | number | Height of the visualization |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT 