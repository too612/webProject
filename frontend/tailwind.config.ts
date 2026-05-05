import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#5c6bc0",
          dark: "#2b2f42",
          muted: "#6d7589",
        },
        sys: {
          dark: "#113a5c",
          mid: "#1f6f78",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 24px rgba(0,0,0,0.08)",
        panel: "0 2px 8px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        card: "16px",
        panel: "12px",
      },
    },
  },
} satisfies Config;
