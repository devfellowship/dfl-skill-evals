import type { Meta, StoryObj } from "@storybook/react"
import { ProfileInfo } from "./ProfileInfo"

const mockUser = {
  name: "Alex Costa",
  email: "alex@devshaper.com",
  avatar: "/placeholder-user.jpg",
  initials: "AC",
}

const meta = {
  title: "Molecules/ProfileInfo",
  component: ProfileInfo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showEmail: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ProfileInfo>

export default meta
type Story = StoryObj<typeof ProfileInfo>

export const Default: Story = {
  args: {
    user: mockUser,
  },
}

export const Small: Story = {
  args: {
    user: mockUser,
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    user: mockUser,
    size: "lg",
  },
}

export const WithoutEmail: Story = {
  args: {
    user: mockUser,
    showEmail: false,
  },
}

export const LongName: Story = {
  args: {
    user: {
      ...mockUser,
      name: "Alexandre Costa Silva dos Santos",
      email: "alexandre.costa.silva.santos@empresa.com.br",
    },
  },
}

export const NoAvatar: Story = {
  args: {
    user: {
      name: "Maria Silva",
      email: "maria@empresa.com",
      initials: "MS",
    },
  },
} 