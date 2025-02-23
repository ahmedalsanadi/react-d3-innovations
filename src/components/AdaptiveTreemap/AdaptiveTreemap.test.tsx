import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdaptiveTreemap } from './AdaptiveTreemap';

describe('AdaptiveTreemap', () => {
  const sampleData = {
    name: "Root",
    children: [
      {
        name: "Category A",
        value: 100,
        children: [
          { name: "A1", value: 40 },
          { name: "A2", value: 60 }
        ]
      }
    ]
  };

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    const { container } = render(
      <AdaptiveTreemap
        data={sampleData}
        width={800}
        height={600}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders zoom controls', () => {
    render(
      <AdaptiveTreemap
        data={sampleData}
        width={800}
        height={600}
      />
    );
    
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeTruthy();
  });
});