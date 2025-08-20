/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],
  theme: {
    extend: {
      colors: {
        // Base theme tokens
        primary: "#1e40af",   // Royal blue
        secondary: "#0ea5e9", // Sky blue
        accent: "#f59e42",    // Soft orange
      },
      screens: {
        xs: "400px",
        // sm, md, lg, xl, 2xl are Tailwind defaults
      },
      borderRadius: {
        "xl": "1rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out both",
        "scale-in": "scale-in 200ms ease-out both"
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.06)",
        softLg: "0 10px 25px rgba(0,0,0,0.08)"
      }
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"]
    }
  },
  plugins: []
};
