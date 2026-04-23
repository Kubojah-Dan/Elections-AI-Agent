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
        saffron: '#FF9933',
        'saffron-light': '#FFBC70',
        'india-green': '#138808',
        'india-navy': 'var(--navy)',
        'india-navy-light': 'var(--navy-light)',
        'off-white': 'var(--bg-secondary)',
        'near-black': 'var(--text-primary)',
        'mid-gray': 'var(--text-secondary)',
        'light-gray': 'var(--border)',
        'border-gray': 'var(--border-strong)',
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.14)',
        'top': '0 -2px 12px rgba(0,0,0,0.08)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
        'wave': 'wave 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '24px' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}
