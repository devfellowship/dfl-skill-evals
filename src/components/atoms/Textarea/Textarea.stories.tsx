import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "./Textarea"
import { Label } from "../Label"

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
}

export const WithValue: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        defaultValue="I'm a software developer with a passion for building beautiful user interfaces."
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="disabled">Disabled</Label>
      <Textarea
        id="disabled"
        placeholder="You cannot edit this textarea."
        disabled
      />
    </div>
  ),
}

export const WithRows: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        placeholder="Enter a detailed description..."
        rows={6}
      />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="feedback">Feedback</Label>
      <Textarea id="feedback" placeholder="What could we improve?" />
      <p className="text-sm text-muted-foreground">
        Your feedback helps us improve our product.
      </p>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="error" className="text-red-500">
        Error Input
      </Label>
      <Textarea
        id="error"
        className="border-red-500 focus-visible:ring-red-500"
        placeholder="This input has an error"
      />
      <p className="text-sm text-red-500">This field is required.</p>
    </div>
  ),
}

export const WithCharacterCount: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="tweet">Tweet</Label>
      <Textarea
        id="tweet"
        placeholder="What's happening?"
        maxLength={280}
        onChange={(e) => {
          const count = e.target.value.length
          const remaining = 280 - count
          document.getElementById("count")!.textContent = `${remaining} characters remaining`
        }}
      />
      <p id="count" className="text-sm text-muted-foreground">
        280 characters remaining
      </p>
    </div>
  ),
} 
