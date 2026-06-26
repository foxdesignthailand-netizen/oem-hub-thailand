import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#10B981",
        background: "#FFFFFF",
        foreground: "#111827",
        primary: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
          deep: "#047857",
          soft: "#D1FAE5",
          light: "#ECFDF5"
        },
        muted: {
          DEFAULT: "#F9FAFB",
          foreground: "#6B7280"
        },
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
        card: "0 8px 28px rgba(15, 23, 42, 0.07)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem"
      }
    }
  },
  plugins: []
};

export default config;
