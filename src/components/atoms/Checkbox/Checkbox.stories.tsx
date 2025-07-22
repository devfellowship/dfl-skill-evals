import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./Checkbox"
import { Label } from "../Label"

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Checked by default</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled">Disabled</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked">Disabled and checked</Label>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing">Marketing emails</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        Receive emails about new products, features, and more.
      </p>
    </div>
  ),
}

export const InForm: Story = {
  render: () => (
    <form className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" name="newsletter" />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="updates" name="updates" />
        <Label htmlFor="updates">Receive product updates</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing-form" name="marketing" />
        <Label htmlFor="marketing-form">Marketing communications</Label>
      </div>
    </form>
  ),
} 
