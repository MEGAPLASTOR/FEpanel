import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        galaxy: {
          bg: '#030818',
          'bg-sub': '#061525',
          card: '#0A1E32',
          'card-hover': '#0D2942',
          primary: '#00D9FF',
          'primary-hover': '#33E6FF',
          secondary: '#7C3AED',
          'secondary-hover': '#9F67FF',
          accent: '#00FFC6',
          highlight: '#70E1FF',
          text: '#EAF9FF',
          'text-sub': '#8BA9BA',
          border: '#153855',
          success: '#00E6A8',
          warning: '#FFD166',
          error: '#FF5577',
        },
        minecraft: {
          primary: '#00D9FF',
          accent: '#00FFC6',
          dark: '#0A1E32',
        },
      },
      boxShadow: {
        'galaxy-glow': '0 0 20px -5px rgba(0, 217, 255, 0.3)',
        'galaxy-purple': '0 0 20px -5px rgba(124, 58, 237, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
