/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0204",
          secondary: "#120508",
          card: "#18080c",
          cardHover: "#220b12",
          border: "#341118",
          borderStrong: "#541824",
          hover: "#220b12",
          primary: "#e11d48",
          primaryHover: "#be123c",
          primaryDark: "#881337",
          electric: "#f43f5e",
          accent: "#fb7185",
          field: "#4c0519",
          success: "#16a34a",
          danger: "#e11d48",
          text: "#fff1f2",
          muted: "#c9a9b0",
          darkMuted: "#805c65",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
