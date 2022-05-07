module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ksv-black': '#333744',
        'ksv-light-gray': '#7B8292',
        'ksv-gray': {
          50: '#868d9a',
          100: '#7c8390',
          200: '#727986',
          300: '#686f7c',
          400: '#5e6572',
          500: '#545b68',
          600: '#4a515e',
          700: '#404754',
          800: '#363d4a',
          900: '#2c3340',
        },
        'ksv-blue': {
          50: '#4ec3ff',
          100: '#44b9ff',
          200: '#3aafff',
          300: '#30a5ff',
          400: '#269bff',
          500: '#1c91f5',
          600: '#1287eb',
          700: '#087de1',
          800: '#0073d7',
          900: '#0069cd',
        },
      },
      fontFamily: {
        roboto: ['Roboto Mono', 'monospace'],
      },
      backgroundImage: {
        default:
          "linear-gradient(0deg, rgba(82, 85, 97, 0.75), rgba(82, 85, 97, 0.75)), url('/imgs/background.jpg')",
      },
    },
  },
  plugins: [],
};
