import type { Meta, StoryObj } from "@storybook/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip"
import { Button } from "../Button/Button"
import { Info, Plus, Settings, HelpCircle } from "lucide-react"

const meta = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Settings</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithHelp: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">API Key</p>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Your API key is used to authenticate API requests.</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const WithLongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-[200px]">
          This is a longer tooltip content that wraps onto multiple lines.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithCustomStyles: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-primary text-primary-foreground">
        <p>Custom styled tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithDelay: Story = {
  render: () => (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Delayed tooltip (1s)</p>
      </TooltipContent>
    </Tooltip>
  ),
} 
