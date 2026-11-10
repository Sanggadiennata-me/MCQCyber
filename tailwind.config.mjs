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
          bg: "#050506",
          secondary: "#0d0d10",
          card: "#121216",
          cardHover: "#18181f",
          border: "#23232a",
          borderStrong: "#383842",
          hover: "#18181f",
          primary: "#e11d48",
          primaryHover: "#be123c",
          primaryDark: "#881337",
          electric: "#f43f5e",
          accent: "#fb7185",
          field: "#1f1014",
          success: "#16a34a",
          danger: "#e11d48",
          text: "#f4f4f5",
          muted: "#9e9ea7",
          darkMuted: "#666672",
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
