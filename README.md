# WindMill — React Application

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
# 기본: http://localhost:3000

# 3) 프로덕션 빌드
npm run build

# 4) 빌드 확인(미리보기 서버)
npm run preview
```

## 🗂️폴더구조

```bash
frontend/
├─ src/
│  ├─ api/              # fetch 유틸/엔드포인트
│  ├─ components/       # 재사용 UI 컴포넌트
│  ├─ style/            # React Bits스타일 라이브러리
│  ├─ assets/           # 로고, static파일
│  ├─ context/          # 전역상태관리(토큰관리)
│  ├─ hooks/            # 커스텀 훅 (React Query 등)
│  ├─ pages/            # 라우트 페이지
│  ├─ util/             # 공용 유틸
│  ├─ apiBase.ts        # api프록시
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
├─ package.json
├─ vercel.json          # 프록시/SPA 라우팅 설정
├─ vite.config.js
├─ postcss.config.js
└─ tailwind.config.js   

```

## API연동

```bash
프론트엔드에서는 항상 상대 경로로 호출합니다.
const res = await fetch('/api/stock');

vercel.json에서 render백엔드로 프록시합니다.
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://windmill-be-5qid.onrender.com/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## ☁️vercel 배포 가이드
1. GitHub 레포를 Vercel에 연결

2. Framework Preset: Vite

3. Build Command: vite build (기본값)

4. Output Directory: dist (기본값)

5. 레포 루트에 vercel.json 포함

6. GitHub 푸시 시:
main → Production 자동 배포
기타 브랜치/PR → Preview 배포
필요 시 Promote to Production으로 프리뷰를 프로덕션에 승격 가능

## 🛠️ 트러블슈팅

**502 Bad Gateway (API 호출)**

- 요청 경로 확인: fetch('/api/stock') 처럼 /api/* 경로인지 확인
- vercel.json의 Render 호스트가 실제 동작하는 주소인지 확인
- Render 무료 플랜은 슬립/웜업으로 첫 요청이 실패할 수 있어 잠시 후 재시도
- Ren der 대시보드 Logs에서 에러/재시작/메모리 이슈 확인

**CORS 에러**
- 콘솔에 CORS 문구가 보이면 백엔드 CORS 허용 도메인 점검
- 개발/프리뷰/프로덕션 도메인을 모두 허용

**새로고침 404**
- SPA 라우팅 rewrite 누락: /(.*) → /index.html 규칙 확인
