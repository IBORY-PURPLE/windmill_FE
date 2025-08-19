#!/usr/bin/env bash
set -euo pipefail
# Codespaces가 켜질 때 Vite dev 서버를 백그라운드로 자동 실행
if ! pgrep -f "vite.*--host" >/dev/null; then
  echo "[postStart] start Vite dev server"
  nohup bash -lc "npm run dev -- --host" >/tmp/fe.log 2>&1 &
  echo "[postStart] logs: /tmp/fe.log"
fi
