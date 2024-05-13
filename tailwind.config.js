/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    colors: {
      'deep-black': '#000000',
      'metallic-gray': '#4F4F4F',
      'mikado-yellow': '#F5C003',
      'dark-red': '#8b0000',
      'stellar-white': '#FFFFFF',
      'silver': '#C0C0C0',
      'black-opacity-80': 'rgba(0, 0, 0, 0.8)',
    },
    fontFamily: {
      orbitron: ['Orbitron', 'sans-serif'],
      robotoMono: ['Roboto Mono', 'monospace'],
      exo2: ['Exo 2', 'sans-serif'],
    },
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },
    scrollbar: ['rounded']
  },
};
export const plugins = [
  require('tailwind-scrollbar')
];
