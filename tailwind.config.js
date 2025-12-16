/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C547',
          dark: '#B8962D'
        },
        burgundy: {
          DEFAULT: '#8B1538',
          dark: '#6D1029'
        },
        forest: {
          DEFAULT: '#1A5D1A'
        },
        cream: {
          DEFAULT: '#FBF8F3'
        },
        'warm-white': '#FEFCF9',
        'warm-gray': '#7D7670',
        charcoal: {
          DEFAULT: '#2C2825',
          light: '#3D3833'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(44, 40, 37, 0.08)',
        'elevated': '0 10px 40px rgba(44, 40, 37, 0.12)',
        'gold-glow': '0 8px 30px rgba(212, 175, 55, 0.35)'
      },
      animation: {
        'petal-fall': 'petal-fall 25s linear infinite',
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'float-slow-reverse': 'float-slow-reverse 25s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 8s ease-in-out infinite',
        'spin-slow': 'spin-slow 30s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        'petal-fall': {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.4' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -20px) scale(1.02)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.98)' }
        },
        'float-slow-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-20px, 20px) scale(0.98)' },
          '66%': { transform: 'translate(15px, -15px) scale(1.02)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.08', transform: 'scale(1)' },
          '50%': { opacity: '0.12', transform: 'scale(1.05)' }
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        'scale-in': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}
