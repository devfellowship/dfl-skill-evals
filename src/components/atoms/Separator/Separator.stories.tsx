import type { Meta, StoryObj } from "@storybook/react"
import { Separator } from "./Separator"

const meta = {
  title: "Atoms/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>Content above</div>
      <Separator />
      <div>Content below</div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-[100px] items-center space-x-4">
      <div>Left</div>
      <Separator orientation="vertical" />
      <div>Right</div>
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative z-10 flex justify-center">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>
    </div>
  ),
}

export const WithCustomStyles: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>Header</div>
      <Separator className="bg-primary" />
      <div>Content</div>
      <Separator className="bg-destructive" />
      <div>Footer</div>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="w-[300px] rounded-lg border p-4 shadow-sm">
      <div className="font-medium">Account</div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <div>Profile</div>
        <div>Settings</div>
        <div>Notifications</div>
      </div>
    </div>
  ),
}

export const InList: Story = {
  render: () => (
    <div className="w-[300px] space-y-1">
      <div className="px-2 py-1">Item 1</div>
      <Separator className="my-1" />
      <div className="px-2 py-1">Item 2</div>
      <Separator className="my-1" />
      <div className="px-2 py-1">Item 3</div>
    </div>
  ),
} 
