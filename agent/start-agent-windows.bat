@echo off
title MINECRAFT CLOUD PANEL - WINDOWS 10 VPS AGENT
color 0A

echo =======================================================
echo   MINECRAFT CLOUD PANEL - WINDOWS 10 VPS AGENT
echo =======================================================
echo.

cd /d "%~dp0"

if not exist "node_modules\@nestjs\core" (
    echo [1/2] Dang tu dong cai dat thu vien cho Agent (chi mat 10 giay)...
    call npm install
)

echo [2/2] Dang khoi dong Agent tren Port 4001...
echo.

set AGENT_PORT=4001
set AGENT_SECRET_KEY=agent_secret_key_123

node dist\main.js

pause
