import type { Meta, StoryObj } from "@storybook/react"
import { Toggle } from "./Toggle"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

const meta = {
  title: "Atoms/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
}

export const WithText: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold className="mr-2 h-4 w-4" />
      Bold
    </Toggle>
  ),
}

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle underline">
      <Underline className="h-4 w-4" />
    </Toggle>
  ),
}

export const Small: Story = {
  render: () => (
    <Toggle size="sm" aria-label="Toggle italic">
      <Italic className="h-3 w-3" />
    </Toggle>
  ),
}

export const Large: Story = {
  render: () => (
    <Toggle size="lg" aria-label="Toggle italic">
      <Italic className="h-5 w-5" />
    </Toggle>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Toggle disabled aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
}

export const TextAlignment: Story = {
  render: () => (
    <div className="flex space-x-2">
      <Toggle aria-label="Toggle left alignment">
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle center alignment">
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle right alignment">
        <AlignRight className="h-4 w-4" />
      </Toggle>
    </div>
  ),
}

export const WithCustomStyles: Story = {
  render: () => (
    <Toggle
      className="bg-blue-100 data-[state=on]:bg-blue-500 data-[state=on]:text-white"
      aria-label="Toggle custom style"
    >
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
}

export const WithPressed: Story = {
  render: () => (
    <Toggle pressed aria-label="Toggle pressed state">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
} 
