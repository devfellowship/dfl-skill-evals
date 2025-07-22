import type { Meta, StoryObj } from "@storybook/react"
import { DifficultyIndicator } from "./DifficultyIndicator"

const meta = {
  title: "Molecules/DifficultyIndicator",
  component: DifficultyIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    difficulty: {
      control: { type: "range", min: 1, max: 5, step: 1 },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showLabel: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof DifficultyIndicator>

export default meta
type Story = StoryObj<typeof DifficultyIndicator>

export const Beginner: Story = {
  args: {
    difficulty: 1,
  },
}

export const Easy: Story = {
  args: {
    difficulty: 2,
  },
}

export const Medium: Story = {
  args: {
    difficulty: 3,
  },
}

export const Hard: Story = {
  args: {
    difficulty: 4,
  },
}

export const Expert: Story = {
  args: {
    difficulty: 5,
  },
}

export const Small: Story = {
  args: {
    difficulty: 3,
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    difficulty: 4,
    size: "lg",
  },
}

export const WithoutLabel: Story = {
  args: {
    difficulty: 3,
    showLabel: false,
  },
}

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <DifficultyIndicator difficulty={1} />
      <DifficultyIndicator difficulty={2} />
      <DifficultyIndicator difficulty={3} />
      <DifficultyIndicator difficulty={4} />
      <DifficultyIndicator difficulty={5} />
    </div>
  ),
} 