/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        // Animation pour le fond de points (mouvement lent et subtil)
        grain: "grain 20s linear infinite",
        // Animation d'apparition fluide pour les textes
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        grain: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-32px, -32px)" }, // Doit correspondre à la taille du background-size
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      // Couleurs personnalisées pour un look premium
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        background: "#030303",
        foreground: "#ffffff",
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#a1a1aa",
        },
      },
    },
  },
  plugins: [],
};
