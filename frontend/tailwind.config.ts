import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#081018",
        ink: "#dce8f5",
        mist: "#8ba0b9",
        line: "rgba(163, 188, 214, 0.18)",
        card: "rgba(9, 19, 30, 0.78)",
        accent: "#4fd1c5",
        coral: "#ff9b71",
        gold: "#f8d66d"
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)"],
        mono: ["var(--font-ibm-plex-mono)"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 10, 18, 0.45)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(79, 209, 197, 0.18), transparent 32%), radial-gradient(circle at top right, rgba(255, 155, 113, 0.18), transparent 28%), radial-gradient(circle at bottom center, rgba(248, 214, 109, 0.14), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
