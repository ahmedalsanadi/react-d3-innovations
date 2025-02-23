import type { Meta, StoryObj } from '@storybook/react';
import { TemporalForceGraph } from '../components/TemporalForceGraph/TemporalForceGraph';

const meta = {
  title: 'Components/TemporalForceGraph',
  component: TemporalForceGraph,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TemporalForceGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNodes = [
  { id: '1', label: 'Node 1', color: '#ff7675' },
  { id: '2', label: 'Node 2', color: '#74b9ff' },
  { id: '3', label: 'Node 3', color: '#55efc4' },
];

const sampleLinks = [
  { source: '1', target: '2' },
  { source: '2', target: '3' },
  { source: '3', target: '1' },
];

export const Default: Story = {
  args: {
    initialNodes: sampleNodes,
    initialLinks: sampleLinks,
    width: 800,
    height: 400,
  },
};

export const WithMoreTimeSteps: Story = {
  args: {
    initialNodes: sampleNodes,
    initialLinks: sampleLinks,
    width: 800,
    height: 400,
    timeSteps: 20,
  },
};