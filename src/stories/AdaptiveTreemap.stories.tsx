import type { Meta, StoryObj } from '@storybook/react';
import { AdaptiveTreemap } from '../components/AdaptiveTreemap/AdaptiveTreemap';

const meta = {
  title: 'Components/AdaptiveTreemap',
  component: AdaptiveTreemap,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdaptiveTreemap>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = {
  name: "Root",
  children: [
    {
      name: "Category A",
      value: 100,
      color: "#ff7675",
      insights: "Growing trend",
      children: [
        { name: "A1", value: 40, color: "#fab1a0" },
        { name: "A2", value: 60, color: "#ffeaa7" }
      ]
    },
    {
      name: "Category B",
      value: 80,
      color: "#74b9ff",
      insights: "Stable performance",
      children: [
        { name: "B1", value: 30, color: "#81ecec" },
        { name: "B2", value: 50, color: "#55efc4" }
      ]
    }
  ]
};

export const Default: Story = {
  args: {
    data: sampleData,
    width: 800,
    height: 400,
  },
};

export const DeepNested: Story = {
  args: {
    data: {
      name: "Root",
      children: [
        {
          name: "A",
          value: 100,
          children: [
            {
              name: "A1",
              value: 50,
              children: [
                { name: "A1a", value: 20 },
                { name: "A1b", value: 30 }
              ]
            },
            {
              name: "A2",
              value: 50,
              children: [
                { name: "A2a", value: 25 },
                { name: "A2b", value: 25 }
              ]
            }
          ]
        }
      ]
    },
    width: 800,
    height: 400,
  },
};