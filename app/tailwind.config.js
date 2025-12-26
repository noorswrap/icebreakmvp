/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        ice: '#d6ecff',
        frost: '#e2f0ff',
        accent: '#7cc3ff',
      },
      boxShadow: {
        card: '0 14px 50px rgba(15, 23, 42, 0.2)',
      },
    },
  },
  plugins: [],
}

