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
          light: '#F5D76E',
          dark: '#B8962D'
        },
        burgundy: {
          DEFAULT: '#8B1538',
          light: '#A91D47',
          dark: '#6D1029'
        },
        forest: {
          DEFAULT: '#1A5D1A',
          light: '#228B22',
          dark: '#145214'
        },
        cream: {
          DEFAULT: '#FAF8F5',
          dark: '#F0EDE8'
        },
        stone: {
          950: '#0C0A09',
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
          50: '#FAFAF9'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Lato', 'sans-serif']
      },
      animation: {
        'fadeIn': 'fadeIn 1s ease-out forwards',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'gentlePulse': 'gentlePulse 3s ease-in-out infinite',
        'float': 'float 20s ease-in-out infinite',
        'orb-float': 'orbFloat 15s ease-in-out infinite',
        'orb-float-reverse': 'orbFloatReverse 18s ease-in-out infinite',
        'orb-pulse': 'orbPulse 10s ease-in-out infinite',
        'ring-pulse': 'ringPulse 3s ease-out infinite',
        'ring-pulse-delay': 'ringPulseDelay 3s ease-out infinite 1.5s',
        'gentle-float': 'gentleFloat 3s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'text-shimmer': 'textShimmer 4s linear infinite',
        'line-expand': 'lineExpand 1s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'kente-shimmer': 'kenteShimmer 2s ease-in-out infinite',
        'kente-shimmer-delay': 'kenteShimmer 2s ease-in-out infinite 1s',
        'modal-enter': 'modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        gentlePulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.1' },
          '25%': { transform: 'translateY(-30px) translateX(10px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-15px) translateX(-10px)', opacity: '0.2' },
          '75%': { transform: 'translateY(-40px) translateX(5px)', opacity: '0.25' }
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' }
        },
        orbFloatReverse: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-30px, 30px) scale(0.95)' },
          '66%': { transform: 'translate(20px, -20px) scale(1.05)' }
        },
        orbPulse: {
          '0%, 100%': { opacity: '0.1', transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { opacity: '0.2', transform: 'translate(-50%, -50%) scale(1.1)' }
        },
        ringPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.1)', opacity: '0.1' },
          '100%': { transform: 'scale(1.2)', opacity: '0' }
        },
        ringPulseDelay: {
          '0%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.15)', opacity: '0.1' },
          '100%': { transform: 'scale(1.3)', opacity: '0' }
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        textShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        },
        lineExpand: {
          '0%': { width: '0' },
          '100%': { width: '4rem' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        kenteShimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        modalEnter: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(212, 175, 55, 0.3)' },
          '50%': { borderColor: 'rgba(212, 175, 55, 0.6)' }
        },
        spin: {
          'to': { transform: 'rotate(360deg)' }
        }
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '1500': '1500ms',
        '2000': '2000ms'
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth-in-out': 'cubic-bezier(0.45, 0, 0.55, 1)'
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px'
      },
      boxShadow: {
        'gold': '0 4px 14px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 10px 40px rgba(212, 175, 55, 0.3)',
        'gold-xl': '0 20px 60px rgba(212, 175, 55, 0.35)',
        'inner-gold': 'inset 0 2px 4px rgba(212, 175, 55, 0.1)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.4)',
        'glow-lg': '0 0 40px rgba(212, 175, 55, 0.5)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent)',
        'hero-pattern': 'linear-gradient(to bottom, rgba(12,10,9,1), rgba(28,25,23,0.8), rgba(12,10,9,1))'
      }
    },
  },
  plugins: [],
}
