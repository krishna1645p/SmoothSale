import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          900: "#042C53",
          800: "#0C447C",
          600: "#185FA5",
          400: "#378ADD",
          200: "#85B7EB",
          100: "#B5D4F4",
          50: "#E6F1FB",
        },
      },
      keyframes: {
        slideIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        in: "slideIn 200ms ease",
      },
    },
  },
  plugins: [],
};
export default config;
