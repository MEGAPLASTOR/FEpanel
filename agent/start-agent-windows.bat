@echo off
title MINECRAFT CLOUD PANEL - WINDOWS 10 VPS AGENT
color 0A

echo =======================================================
echo   MINECRAFT CLOUD PANEL - WINDOWS 10 VPS AGENT
echo =======================================================
echo.

cd /d "%~dp0"

set AGENT_PORT=4001
set AGENT_SECRET_KEY=agent_secret_key_123

echo Dang khoi dong Agent tren Port 4001...
node dist\main.js

pause
