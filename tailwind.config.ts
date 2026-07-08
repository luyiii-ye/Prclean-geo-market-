import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dashboard: {
          page: "#F7F8FA",
          card: "#FFFFFF",
          text: "#111827",
          sub: "#6B7280",
          weak: "#9CA3AF",
          map: "#E5E7EB",
          orange: "#F97316",
          deepOrange: "#EA580C",
          yellow: "#FDE68A",
          line: "#E5E7EB",
          verified: "#16A34A",
          link: "#2563EB"
        }
      }
    }
  },
  plugins: []
};

export default config;
