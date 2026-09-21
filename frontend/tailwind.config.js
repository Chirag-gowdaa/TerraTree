/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06090d",
        surface: {
          DEFAULT: "#0d131a",
          secondary: "#121a24",
          elevated: "#182330",
          border: "#1e2c3d",
          hover: "#1a2533"
        },
        forest: {
          950: "#02170d",
          900: "#042c19",
          800: "#064e2b",
          700: "#065f38",
          600: "#059669",
          500: "#10b981",
          400: "#34d399",
          300: "#6ee7b7",
          100: "#d1fae5"
        },
        telemetry: {
          cyan: "#00f2fe",
          amber: "#f59e0b",
          green: "#10b981",
          muted: "#64748b",
          bright: "#38bdf8"
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'Consolas', 'monospace'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif']
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px)",
        'scanlines': "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)"
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 6s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
