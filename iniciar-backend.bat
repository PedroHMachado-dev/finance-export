@echo off
title Backend - Finance Control (Spring Boot)
echo ========================================================
echo   Iniciando Backend Spring Boot na porta 8080...
echo ========================================================

cd /d "%~dp0backend"
where java >nul 2>&1 || (echo ERRO: Java 17 ou superior nao encontrado no PATH. & pause & exit /b 1)
where mvn >nul 2>&1 || (echo ERRO: Maven nao encontrado no PATH. & pause & exit /b 1)
call mvn spring-boot:run
pause
