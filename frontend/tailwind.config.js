/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundSize: {
        "200%": "200% 200%",
      },
      animation: {
        "pulse-green": "pulseGradientGreen 3s ease-in-out infinite",
        "pulse-red": "pulseGradientRed 3s ease-in-out infinite",
      },
      keyframes: {
        pulseGradientGreen: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            filter: "brightness(1)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            filter: "brightness(1.2)",
          },
        },
        pulseGradientRed: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            filter: "brightness(1)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            filter: "brightness(1.2)",
          },
        },
      },
    },
    screens: {
      sm: "640px",
      md: "768px", // 이 지점부터 사이드 패널 표시
      lg: "1024px",
    },
  },
  plugins: [],
};
