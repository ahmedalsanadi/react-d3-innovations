import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TemporalForceGraph } from './TemporalForceGraph';

describe('TemporalForceGraph', () => {
  const sampleNodes = [
    { id: '1', label: 'Node 1' },
    { id: '2', label: 'Node 2' },
  ];

  const sampleLinks = [
    { source: '1', target: '2' },
  ];

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    const { container } = render(
      <TemporalForceGraph
        initialNodes={sampleNodes}
        initialLinks={sampleLinks}
        width={800}
        height={600}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders time control buttons', () => {
    render(
      <TemporalForceGraph
        initialNodes={sampleNodes}
        initialLinks={sampleLinks}
        width={800}
        height={600}
      />
    );
    
    expect(screen.getByRole('button', { name: /play/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /rewind/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /fast forward/i })).toBeTruthy();
  });
});