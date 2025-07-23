import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  "stories": [
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/**/*.mdx"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  }
};
export default config;