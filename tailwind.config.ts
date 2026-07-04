import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        paper: "#f7f8fb",
        line: "#d9e0ea",
        pine: "#145c58",
        coral: "#d95f43",
        amber: "#b7791f"
      }
    }
  },
  plugins: []
};

export default config;
