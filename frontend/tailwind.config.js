/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "640px",
      md: "768px", // 이 지점부터 사이드 패널 표시
      lg: "1024px",
    },
  },
  plugins: [],
};
