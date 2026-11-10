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
          bg: "#080B12",
          secondary: "#101522",
          card: "#151C2B",
          border: "#1E293B",
          hover: "#1E2638",
          primary: "#2563EB",
          electric: "#3B82F6",
          accent: "#FACC15",
          success: "#22C55E",
          danger: "#EF4444",
          text: "#F8FAFC",
          muted: "#94A3B8",
          darkMuted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(59, 130, 246, 0.3)",
        "glow-accent": "0 0 20px -5px rgba(250, 204, 21, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
