#!/usr/bin/env bash
set -euo pipefail
echo "[postCreate] npm install"
if [ -f package-lock.json ]; then npm ci; else npm i; fi
echo "[postCreate] done"
