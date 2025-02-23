import type { Meta, StoryObj } from '@storybook/react';
import { SmartNetworkNavigator } from '../components/SmartNetworkNavigator/SmartNetworkNavigator';

const meta = {
  title: 'Components/SmartNetworkNavigator',
  component: SmartNetworkNavigator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SmartNetworkNavigator>;

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
    nodes: sampleNodes,
    links: sampleLinks,
    width: 800,
    height: 400,
  },
};

export const WithCustomColors: Story = {
  args: {
    nodes: sampleNodes.map(node => ({ ...node, color: '#' + Math.floor(Math.random()*16777215).toString(16) })),
    links: sampleLinks,
    width: 800,
    height: 400,
  },
};