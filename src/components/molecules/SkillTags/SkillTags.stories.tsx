import type { Meta, StoryObj } from "@storybook/react"
import { SkillTags } from "./SkillTags"

const mockSkills = [
  "React",
  "TypeScript", 
  "Node.js",
  "MongoDB",
  "GraphQL",
  "Docker",
  "AWS",
  "PostgreSQL"
]

const meta = {
  title: "Molecules/SkillTags",
  component: SkillTags,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    maxVisible: {
      control: { type: "range", min: 1, max: 10, step: 1 },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "secondary", "outline"],
    },
  },
} satisfies Meta<typeof SkillTags>

export default meta
type Story = StoryObj<typeof SkillTags>

export const Default: Story = {
  args: {
    skills: mockSkills.slice(0, 4),
  },
}

export const WithOverflow: Story = {
  args: {
    skills: mockSkills,
    maxVisible: 3,
  },
}

export const Small: Story = {
  args: {
    skills: mockSkills.slice(0, 5),
    size: "sm",
    maxVisible: 3,
  },
}

export const Large: Story = {
  args: {
    skills: mockSkills.slice(0, 4),
    size: "lg",
  },
}

export const Outline: Story = {
  args: {
    skills: mockSkills.slice(0, 4),
    variant: "outline",
  },
}

export const Secondary: Story = {
  args: {
    skills: mockSkills.slice(0, 4),
    variant: "secondary",
  },
}

export const ManySkills: Story = {
  args: {
    skills: mockSkills,
    maxVisible: 2,
  },
}

export const FewSkills: Story = {
  args: {
    skills: ["React", "TypeScript"],
    maxVisible: 5,
  },
} 