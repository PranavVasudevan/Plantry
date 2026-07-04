/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Inter"', "sans-serif"]
      },
      colors: {
        plantry: {
          dark: "#1C1C1E",
          light: "#F5F5F0",
          sage: "#4A5D4F",
          sageDark: "#2F3E35",
          cream: "#EBEAE4",
          stone: "#A8A29E",
          accent: "#C5A059",
          text: "#2D2A26",
          textLight: "#8C8885"
        }
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};