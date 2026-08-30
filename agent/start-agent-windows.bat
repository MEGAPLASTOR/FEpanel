@echo off
title MINECRAFT CLOUD PANEL - WINDOWS 10 VPS AGENT
color 0A

echo =======================================================
echo   MINECRAFT CLOUD PANEL - WINDOWS 10 VPS AGENT
echo =======================================================
echo.

cd /d "%~dp0"

echo [1/3] Kiem tra Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] May cua ban chua cai Node.js! Vui long cai Node.js tu https://nodejs.org/ roi chay lai.
    pause
    exit /b
)

echo [2/3] Cai dat thu vien can thiet...
if not exist "node_modules" (
    call npm install
)

echo [3/3] Dang khoi dong Agent tren Port 4001...
echo.
set AGENT_PORT=4001
set AGENT_SECRET_KEY=agent_secret_key_123

call npm run start:dev

pause
