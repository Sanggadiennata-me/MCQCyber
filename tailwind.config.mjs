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
          bg: "#080D1A",           // Canvas deep navy background (ItechV2)
          secondary: "#0F182E",    // Surface navy (ItechV2)
          card: "#131E3D",         // Navy card surface (ItechV2)
          cardHover: "#18295E",    // Deep navy hover (ItechV2)
          border: "#1E2C4F",       // Subtle navy border (ItechV2)
          borderStrong: "#2A3A68", // Stronger navy border (ItechV2)
          hover: "#162342",        // Surface hover
          primary: "#FAA322",      // iTech signature warm amber/orange accent
          primaryHover: "#F59E0B", // Bright gold-amber hover
          primaryDark: "#D97706",  // Amber dark
          electric: "#FACC15",     // Accent gold (ItechV2)
          accent: "#FDE047",       // Light gold
          techBlue: "#2563EB",     // iTech tech blue
          navyLight: "#1E284C",    // Navy light
          field: "#0B132B",        // Input fields container
          success: "#10B981",      // Success green
          danger: "#EF4444",       // Danger red
          text: "#F8FAFC",         // Crisp white foreground (ItechV2)
          muted: "#94A3B8",        // Slate-400 muted text (ItechV2)
          darkMuted: "#64748B",    // Slate-500
          ink: "#080D1A",          // Dark ink for high contrast on primary accent
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["'Epilogue'", "'DM Sans'", "sans-serif"],
        display: ["'Epilogue'", "'DM Sans'", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
