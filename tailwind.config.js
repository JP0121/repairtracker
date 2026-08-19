/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0F0F13',      // deep background
          card: '#1C1C24',    // card / container background
        },
        brand: {
          DEFAULT: '#8A2BE2', // purple base
          hover: '#A855F7',   // hover
          active: '#6B21A8',  // active
        },
        ink: {
          DEFAULT: '#F8F8F2', // off-white text
          muted: '#A1A1AA',   // muted text / borders
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
