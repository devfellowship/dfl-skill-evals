import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "./Switch"
import { Label } from "../Label"

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="wifi" defaultChecked />
      <Label htmlFor="wifi">Wi-Fi</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="bluetooth" disabled />
      <Label htmlFor="bluetooth">Bluetooth</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="mobile-data" disabled defaultChecked />
      <Label htmlFor="mobile-data">Mobile Data</Label>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <div className="flex items-center space-x-2">
        <Switch id="notifications" />
        <Label htmlFor="notifications">Push Notifications</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        Receive notifications about important updates and events.
      </p>
    </div>
  ),
}

export const InForm: Story = {
  render: () => (
    <form className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="dark-mode" name="dark-mode" />
        <Label htmlFor="dark-mode">Dark Mode</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="sound" name="sound" />
        <Label htmlFor="sound">Sound Effects</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="auto-update" name="auto-update" />
        <Label htmlFor="auto-update">Automatic Updates</Label>
      </div>
    </form>
  ),
} 
