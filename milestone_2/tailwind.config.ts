import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'metallica-blue-50': '#F0F9FB',
        'metallica-blue-100': '#D9F0F4',
        'metallica-blue-200': '#B8E1E9',
        'metallica-blue-300': '#86CBDA',
        'metallica-blue-400': '#5DB2C7',
        'metallica-blue-500': '#318FA8',
        'metallica-blue-600': '#2D758D',
        'metallica-blue-700': '#2A5F74',
        'metallica-blue-800': '#2A5060',
        'metallica-blue-900': '#274353',
        'metallica-blue-950': '#152B37',
        'metallica-blue-off-charts': '#4C798B',
      },
    },
  },
  plugins: [],
}
export default config 