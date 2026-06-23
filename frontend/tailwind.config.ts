import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luminar: "#2EA37A",
      },
      fontFamily: {
        cabinet: ["var(--font-cabinet)", "sans-serif"],
        zodiak: ["var(--font-zodiak)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

