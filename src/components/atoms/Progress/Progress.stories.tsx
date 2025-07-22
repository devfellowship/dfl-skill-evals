import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "./Progress"
import { Label } from "../Label"

const meta = {
  title: "Atoms/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Loading...</Label>
      <Progress value={45} />
    </div>
  ),
}

export const Zero: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Starting...</Label>
      <Progress value={0} />
    </div>
  ),
}

export const Half: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Halfway there</Label>
      <Progress value={50} />
    </div>
  ),
}

export const Complete: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Complete!</Label>
      <Progress value={100} />
    </div>
  ),
}

export const WithPercentage: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <div className="flex justify-between">
        <Label>Uploading...</Label>
        <span className="text-sm text-muted-foreground">75%</span>
      </div>
      <Progress value={75} />
    </div>
  ),
}

export const WithCustomStyles: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Custom Progress</Label>
      <Progress
        value={60}
        className="h-2 bg-gray-200 [&>div]:bg-green-500"
      />
    </div>
  ),
}

export const WithMultipleSteps: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <Label>Step 1: Download</Label>
        <Progress value={100} />
      </div>
      <div className="space-y-2">
        <Label>Step 2: Install</Label>
        <Progress value={65} />
      </div>
      <div className="space-y-2">
        <Label>Step 3: Configure</Label>
        <Progress value={0} />
      </div>
    </div>
  ),
} 
