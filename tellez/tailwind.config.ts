import type { Config } from "tailwindcss";

/**
 * HuskyOS.
 *
 * Windows-shaped so it reads as a desktop immediately, but every colour and
 * icon is ours — no Microsoft assets anywhere in this project.
 */
export default {
  content: ["./index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        husky: {
          // Matches nusec.club: neutral near-black surfaces, one purple accent
          // (the site's hsl(270 95% 60%)). Blue-tinted greys read as a
          // different brand next to the club site on the projector.
          wall: "#0a0a0a",
          glass: "rgba(20, 20, 22, 0.86)",
          chrome: "#161618",
          edge: "#2a2a2e",
          ink: "#f4f4f5",
          dim: "#a1a1aa",
          faint: "#6b6b75",
          accent: "#9938fa",
          warn: "#f0a33c",
          bad: "#f0625d",
          good: "#48c98a",
        },
      },
      fontFamily: {
        ui: ["Segoe UI Variable", "Segoe UI", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        win: "0 24px 64px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)",
        bar: "0 -1px 0 rgba(255,255,255,0.06)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(6px) scale(0.99)" }, to: { opacity: "1", transform: "none" } },
        toast: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { rise: "rise 140ms ease-out", toast: "toast 200ms ease-out" },
    },
  },
  plugins: [],
} satisfies Config;
