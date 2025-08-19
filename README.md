## 학술제 시연 – GitHub Codespaces로 프런트 실행 (백엔드: Render)

**설치 없이 브라우저 클릭 한 번으로 실행됩니다.**
- 백엔드 주소: `https://windmill-be-5qid.onrender.com` (Render)
- 프런트는 Codespaces에서 실행되며, **/api 프록시**를 통해 CORS 없이 통신합니다.

### 1) Codespaces 열기
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=IBORY-PURPLE%2Fwindmill_FE)


### 2) 자동 구동
- 최초 1~2분 동안 의존성 설치 후 **Vite dev server**가 자동으로 실행됩니다.
- 우측 하단 알림의 **Forwarded Port 3000** 링크를 클릭하면 앱이 열립니다.
- 자동 실행이 보이지 않으면 터미널에서 수동으로 실행:
  1. npm ci
  2. npm run dev -- --host
