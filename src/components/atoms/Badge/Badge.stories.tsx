import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./Badge"
import { Check, X, Star, Zap } from "lucide-react"

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: "Badge",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Check className="mr-1 h-3 w-3" />
        Success
      </>
    ),
  },
}

export const WithIconSecondary: Story = {
  args: {
    variant: "secondary",
    children: (
      <>
        <Star className="mr-1 h-3 w-3" />
        Featured
      </>
    ),
  },
}

export const WithIconDestructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <X className="mr-1 h-3 w-3" />
        Error
      </>
    ),
  },
}

export const WithIconOutline: Story = {
  args: {
    variant: "outline",
    children: (
      <>
        <Zap className="mr-1 h-3 w-3" />
        Premium
      </>
    ),
  },
}

export const Small: Story = {
  args: {
    children: "Small",
    className: "text-[10px] px-2",
  },
}

export const Large: Story = {
  args: {
    children: "Large",
    className: "text-sm px-4 py-1",
  },
}

export const WithCustomColors: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="bg-blue-500 hover:bg-blue-600">Blue</Badge>
      <Badge className="bg-green-500 hover:bg-green-600">Green</Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-600">Yellow</Badge>
      <Badge className="bg-red-500 hover:bg-red-600">Red</Badge>
      <Badge className="bg-purple-500 hover:bg-purple-600">Purple</Badge>
    </div>
  ),
}

export const WithCustomBorders: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="outline" className="border-blue-500 text-blue-500">
        Blue
      </Badge>
      <Badge variant="outline" className="border-green-500 text-green-500">
        Green
      </Badge>
      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
        Yellow
      </Badge>
      <Badge variant="outline" className="border-red-500 text-red-500">
        Red
      </Badge>
      <Badge variant="outline" className="border-purple-500 text-purple-500">
        Purple
      </Badge>
    </div>
  ),
} 
