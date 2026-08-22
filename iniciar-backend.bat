@echo off
title Backend - Finance Control (Spring Boot)
echo ========================================================
echo   Iniciando Backend Spring Boot na porta 8080...
echo ========================================================

set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot"
set "PATH=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot\bin;C:\Users\gobla\maven\bin;%PATH%"

cd /d "%~dp0backend"
call "C:\Users\gobla\maven\bin\mvn.cmd" spring-boot:run
pause
