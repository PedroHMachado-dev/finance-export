@echo off
title Finance Control Launcher
echo ========================================================
echo   Iniciando Backend e Frontend simultaneamente...
echo ========================================================

start "Backend Spring Boot" cmd /k "%~dp0iniciar-backend.bat"
timeout /t 3 /nobreak >nul
start "Frontend React" cmd /k "%~dp0iniciar-frontend.bat"

echo Tudo pronto! O sistema estara acessivel em: http://localhost:5173
pause
