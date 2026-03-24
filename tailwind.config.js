/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sky: {
          50: '#eefbff',
          100: '#d7f4ff',
          200: '#afe8ff',
          300: '#74d7ff',
          400: '#2fc0ff',
          500: '#0aa7f0',
          600: '#0286cb',
          700: '#056aa3',
          800: '#0a5885',
          900: '#10496d'
        },
        sun: {
          100: '#fff7d6',
          300: '#ffe27a',
          500: '#ffbf3c',
          600: '#f59e0b'
        },
        grass: {
          100: '#e8ffe0',
          300: '#8fe36d',
          500: '#3dbb4a',
          700: '#22863a'
        },
        night: {
          700: '#1f2940',
          900: '#101827'
        }
      },
    },
  },
  plugins: [],
}
