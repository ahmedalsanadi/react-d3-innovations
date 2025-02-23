import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { SmartNetworkNavigator } from './SmartNetworkNavigator';

describe('SmartNetworkNavigator', () => {
  const sampleNodes = [
    { id: '1', label: 'Node 1' },
    { id: '2', label: 'Node 2' },
  ];

  const sampleLinks = [
    { source: '1', target: '2' },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <SmartNetworkNavigator
        nodes={sampleNodes}
        links={sampleLinks}
        width={800}
        height={600}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('calls onNodeClick when a node is clicked', async () => {
    const onNodeClick = vi.fn();
    const { container } = render(
      <SmartNetworkNavigator
        nodes={sampleNodes}
        links={sampleLinks}
        width={800}
        height={600}
        onNodeClick={onNodeClick}
      />
    );
    
    // Wait for D3 to render nodes
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const node = container.querySelector('.node');
      if (node) {
        fireEvent.click(node);
      }
    });

    expect(onNodeClick).toHaveBeenCalled();
  });
});