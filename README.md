# WindMill — React Frontend

웹 기반 주가/포트폴리오 앱의 React 프론트엔드입니다. Vite로 빌드하고 Vercel에 배포하며, Render의 FastAPI 백엔드와 `/api/*` 프록시로 연동합니다.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-%20-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-%23FF4154)](https://tanstack.com/query/latest)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

**Production:** https://windmill-fe-yn59.vercel.app/

---

## ✨ 주요 기능

- React 18 + Vite 기반 빠른 개발 환경
- React Router v6 라우팅
- TanStack Query로 서버 상태 관리 (Devtools 포함)
- Recharts로 차트 시각화
- React-Select, React-Toastify, Day.js, Framer Motion 활용
- Vercel `rewrites`로 `/api/*` → Render FastAPI 프록시
- SPA 라우팅을 위한 `index.html` rewrite

---

## 📦 기술 스택

- **UI:** React, Framer Motion, React-Icons
- **상태/데이터:** @tanstack/react-query, react-query-devtools
- **차트/컴포넌트:** Recharts, React-Select, React-Toastify
- **유틸:** Day.js
- **번들/개발서버:** Vite
- **배포:** Vercel (GitHub 연결)

> CRA(`react-scripts`)는 사용하지 않습니다. 본 프로젝트는 **Vite**를 사용합니다.

---

## 🧰 사전 요구사항

- **Node.js** ≥ 18 (LTS 권장)
- **npm** ≥ 9

---

## 🚀 빠른 시작

```bash
# 1) 의존성 설치
npm install

# 2) 로컬 개발 서버 실행
npm run dev
# 기본: http://localhost:5173

# 3) 프로덕션 빌드
npm run build

# 4) 빌드 확인(미리보기 서버)
npm run preview
