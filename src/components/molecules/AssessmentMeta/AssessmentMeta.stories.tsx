import type { Meta, StoryObj } from "@storybook/react"
import { AssessmentMeta } from "./AssessmentMeta"

const meta = {
  title: "Molecules/AssessmentMeta",
  component: AssessmentMeta,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    duration: {
      control: "text",
    },
    participants: {
      control: "number",
    },
    rating: {
      control: { type: "range", min: 0, max: 5, step: 0.1 },
    },
    problems: {
      control: "number",
    },
  },
} satisfies Meta<typeof AssessmentMeta>

export default meta
type Story = StoryObj<typeof AssessmentMeta>

export const Complete: Story = {
  args: {
    duration: "90 min",
    participants: 1247,
    rating: 4.8,
    problems: 5,
  },
}

export const DurationOnly: Story = {
  args: {
    duration: "60 min",
  },
}

export const ParticipantsOnly: Story = {
  args: {
    participants: 2156,
  },
}

export const RatingOnly: Story = {
  args: {
    rating: 4.9,
  },
}

export const ProblemsOnly: Story = {
  args: {
    problems: 3,
  },
}

export const Small: Story = {
  args: {
    duration: "45 min",
    participants: 892,
    rating: 4.7,
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    duration: "120 min",
    participants: 5432,
    rating: 4.6,
    problems: 8,
    size: "lg",
  },
}

export const HighNumbers: Story = {
  args: {
    duration: "90 min",
    participants: 123456,
    rating: 4.95,
    problems: 12,
  },
} 