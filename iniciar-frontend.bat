@echo off
title Frontend - Finance Control (React + Vite)
echo ========================================================
echo   Iniciando Frontend React na porta 5173...
echo ========================================================

cd /d "%~dp0frontend"
where node >nul 2>&1 || (echo ERRO: Node.js 18 ou superior nao encontrado no PATH. & pause & exit /b 1)
where npm >nul 2>&1 || (echo ERRO: npm nao encontrado no PATH. & pause & exit /b 1)
if not exist node_modules call npm install
call npm run dev
pause
