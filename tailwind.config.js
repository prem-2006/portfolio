/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        accent: '#e63946',
        cyan: '#00f0ff',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-border': 'gradient-border 3s ease infinite',
        'dust': 'dust 20s linear infinite',
        'code-rain': 'code-rain 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', filter: 'blur(10px)' },
          '50%': { opacity: '0.8', filter: 'blur(20px)' },
        },
        'gradient-border': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        dust: {
          '0%': { transform: 'translateY(100vh) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(100px)', opacity: '0' },
        },
        'code-rain': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '0.1' },
          '90%': { opacity: '0.1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
