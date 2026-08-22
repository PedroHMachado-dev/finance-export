@echo off
title Frontend - Finance Control (React + Vite)
echo ========================================================
echo   Iniciando Frontend React na porta 5173...
echo ========================================================

set "PATH=C:\Program Files\nodejs;%PATH%"

cd /d "%~dp0frontend"
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
