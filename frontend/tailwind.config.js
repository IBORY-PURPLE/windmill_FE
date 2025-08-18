/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {

      backgroundSize: {
        "200%": "200% 200%",
      },
      fontFamily: {
        customfont: [
          'Times New Roman',           // 영문, serif 계열
          'Nanum Myeongjo',      // 한글 전용 폰트 (혹은 Noto Sans KR 등)
          'serif'
        ],
        windmill: [
          'Noto Sans KR',
          'sans-serif'
        ]
      },
      animation: {
        "pulse-green": "pulseGradientGreen 3s ease-in-out infinite",
        "pulse-red": "pulseGradientRed 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
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
  variants: {
    extend: {},
  },
  plugins: [],
};
