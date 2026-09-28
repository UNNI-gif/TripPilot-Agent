/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F4ECE0',
          300: '#EADECF',
          400: '#D8C5B0',
          500: '#BFA88F',
          600: '#9E866D',
          700: '#7D6751',
          800: '#5C4A38',
          900: '#3D3023',
        },
        terracotta: {
          50: '#FDF4F0',
          100: '#FCE7DF',
          200: '#F8CEBE',
          300: '#F2AB93',
          400: '#E87D5D',
          500: '#D9532F',
          600: '#C84B26',
          700: '#A4391A',
          800: '#832E16',
          900: '#682613',
        },
        sage: {
          50: '#F3F7F4',
          100: '#E4EDE7',
          200: '#C8DBD0',
          300: '#A2C2AF',
          400: '#75A387',
          500: '#4E8363',
          600: '#3B684D',
          700: '#30523E',
          800: '#274233',
          900: '#20362A',
        },
        ochre: {
          50: '#FDF9EE',
          100: '#FBF0D4',
          200: '#F6DEA6',
          300: '#ECC670',
          400: '#DFAB40',
          500: '#C98D25',
          600: '#A96E1D',
          700: '#83501A',
          800: '#693F19',
          900: '#553418',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 6px -1px rgba(130, 80, 40, 0.06)',
        'warm': '0 8px 24px -4px rgba(130, 80, 40, 0.08), 0 4px 8px -2px rgba(130, 80, 40, 0.04)',
        'warm-lg': '0 16px 36px -6px rgba(130, 80, 40, 0.12), 0 8px 16px -4px rgba(130, 80, 40, 0.06)',
      }
    },
  },
  plugins: [],
}
