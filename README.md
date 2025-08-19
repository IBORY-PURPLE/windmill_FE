## 학술제 시연용: GitHub Codespaces 실행가이드

**설치 없이 브라우저만으로 실행됩니다.**

1) 아래 버튼을 클릭하세요(또는 레포 상단의 **Code ▸ Create codespace on main**).
   
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=<OWNER>%2F<REPO>)

2) 최초 1~2분 동안 자동으로 개발환경이 구성됩니다. 완료 후 오른쪽 하단 알림에 **포트 5173(Vite)** 링크가 뜨면 클릭하세요.  
   - 자동 실행이 되지 않았다면, VS Code 터미널 2개를 열어 아래를 각각 실행:
     - `cd web && npm run dev -- --host`
     - `cd api && uvicorn main:app --reload --host 0.0.0.0 --port 8000`

3) 접속 후 화면이 보이면 완료입니다.  
   - API 헬스체크: 브라우저에서 `/api/health` (프록시 경로) 열어보면 `{"ok": true}`가 표시됩니다.

> ⚙️ 환경변수가 필요한 경우  
> 레포지터리 ▸ Settings ▸ Codespaces ▸ **Secrets** 에 키를 등록한 뒤, 앱에서 `process.env.MY_KEY`(Vite는 `import.meta.env.VITE_*`)나 `os.environ["MY_KEY"]`로 사용하세요.
