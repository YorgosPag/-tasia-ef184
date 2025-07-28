import type { Config } from "tailwindcss"

import tasiaConfig from './src/tasia/theme/tailwind.config.tasia';

const config: Config = {
  ...tasiaConfig,
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
	],
}

export default config;
