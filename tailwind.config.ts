import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      backgroundImage: {
        'angular': 'linear-gradient(to right, #dc2626, #f87171)', // from-red-600 to-red-400
        'react': 'linear-gradient(to right, #22d3ee, #3b82f6)',   // from-cyan-400 to-blue-500
        'vue': 'linear-gradient(to right, #4ade80, #16a34a)',     // from-green-400 to-green-600
      },
    },
  },
  darkMode: 'class',
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('flowbite/plugin')],
};

export default config;