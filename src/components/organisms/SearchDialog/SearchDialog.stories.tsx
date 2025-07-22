import type { Meta, StoryObj } from "@storybook/react"
import { SearchDialog } from "./SearchDialog"
import { fn } from "@storybook/test"

const meta = {
  title: "Organisms/SearchDialog",
  component: SearchDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSearch: {
      action: "onSearch",
      description: "Callback quando uma busca é realizada",
    },
    currentQuery: {
      control: "text",
      description: "Query atual de busca",
    },
    currentFilters: {
      control: "object",
      description: "Filtros atuais aplicados",
    },
  },
} satisfies Meta<typeof SearchDialog>

export default meta
type Story = StoryObj<typeof SearchDialog>

export const Empty: Story = { 
  args: {
    onSearch: fn(),
    currentQuery: "",
    currentFilters: {
      skills: [],
      difficulties: [],
      durations: [],
      minRating: 0,
    },
  },
}

export const WithQuery: Story = {
  args: {
    onSearch: fn(),
    currentQuery: "React TypeScript",
    currentFilters: {
      skills: [],
      difficulties: [],
      durations: [],
      minRating: 0,
    },
  },
}

export const WithFilters: Story = {
  args: {
    onSearch: fn(),
    currentQuery: "",
    currentFilters: {
      skills: ["React", "TypeScript"],
      difficulties: ["3"],
      durations: ["60 min"],
      minRating: 0,
    },
  },
}

export const Complete: Story = {
  args: {
    onSearch: fn(),
    currentQuery: "Frontend Development",
    currentFilters: {
      skills: ["React", "TypeScript", "JavaScript"],
      difficulties: ["3", "4"],
      durations: ["60 min", "90 min"],
      minRating: 4,
    },
  },
}

export const Interactive: Story = {
  args: {
    onSearch: fn(),
    currentQuery: "",
    currentFilters: {
      skills: [],
      difficulties: [],
      durations: [],
      minRating: 0,
    },
  },
} 
