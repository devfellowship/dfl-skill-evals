import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./Label"
import { Input } from "../Input"

const meta = {
  title: "Atoms/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {
    children: "Label",
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username" className="after:text-red-500 after:content-['*']">
        Username
      </Label>
      <Input type="text" id="username" placeholder="Enter your username" required />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled">Disabled</Label>
      <Input type="text" id="disabled" disabled />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="helper">Password</Label>
      <Input type="password" id="helper" />
      <p className="text-sm text-muted-foreground">
        Password must be at least 8 characters long
      </p>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="error" className="text-red-500">
        Email
      </Label>
      <Input
        type="email"
        id="error"
        className="border-red-500 focus-visible:ring-red-500"
      />
      <p className="text-sm text-red-500">Please enter a valid email address</p>
    </div>
  ),
} 
