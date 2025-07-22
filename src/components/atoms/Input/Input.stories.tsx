import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./Input"
import { Search, Mail, Lock } from "lucide-react"

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter email...",
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
}

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter number...",
  },
}

export const SearchInput: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
}

export const Tel: Story = {
  args: {
    type: "tel",
    placeholder: "Enter phone number...",
  },
}

export const URL: Story = {
  args: {
    type: "url",
    placeholder: "Enter URL...",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
}

export const Required: Story = {
  args: {
    required: true,
    placeholder: "Required field",
  },
}

export const WithValue: Story = {
  args: {
    value: "Input with value",
    readOnly: true,
  },
}

export const WithError: Story = {
  args: {
    placeholder: "Input with error",
    className: "border-red-500 focus-visible:ring-red-500",
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-10" placeholder="Search..." />
    </div>
  ),
}

export const WithEmailIcon: Story = {
  render: () => (
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="email" className="pl-10" placeholder="Enter email..." />
    </div>
  ),
}

export const WithPasswordIcon: Story = {
  render: () => (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="password" className="pl-10" placeholder="Enter password..." />
    </div>
  ),
}

export const Small: Story = {
  args: {
    className: "h-8 text-sm",
    placeholder: "Small input",
  },
}

export const Large: Story = {
  args: {
    className: "h-12 text-lg",
    placeholder: "Large input",
  },
} 
