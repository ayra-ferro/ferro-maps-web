/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ferro-primary": "#1E7BFF",
        "ferro-deep": "#0A4FCC",
        "ferro-sky": "#5BA8FF",
        "ferro-tint": "#E8F1FF",
        "ferro-ink": "#000000",
        "ferro-signal": "#FFB72E",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
      },
      borderRadius: {
        button: "8px",
        card: "12px",
        sheet: "16px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
      },
    },
  },
  plugins: [],
}

