import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./Slider"
import { Label } from "../Label"

const meta = {
  title: "Atoms/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Volume</Label>
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  ),
}

export const WithValue: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Temperature</Label>
      <div className="flex items-center space-x-4">
        <Slider defaultValue={[24]} max={40} min={16} step={0.5} />
        <span className="w-12 text-sm">24°C</span>
      </div>
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Price Range</Label>
      <div className="flex items-center space-x-4">
        <Slider defaultValue={[25, 75]} max={100} step={1} />
        <span className="w-20 text-sm">$25 - $75</span>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Brightness</Label>
      <Slider defaultValue={[80]} disabled max={100} step={1} />
    </div>
  ),
}

export const WithSteps: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Size</Label>
      <Slider defaultValue={[50]} max={100} step={10} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>XS</span>
        <span>S</span>
        <span>M</span>
        <span>L</span>
        <span>XL</span>
      </div>
    </div>
  ),
}

export const WithCustomStyles: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Progress</Label>
      <Slider
        defaultValue={[60]}
        max={100}
        step={1}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:focus-visible:ring-primary"
      />
    </div>
  ),
} 
