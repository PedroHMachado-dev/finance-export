@echo off
title FinanceExport - Docker Launcher
echo ========================================================
echo   FinanceExport - Inicializacao com Docker Compose
echo ========================================================
echo.

where docker >nul 2>&1 || (
    echo [ERRO] Docker nao foi encontrado no PATH.
    echo Por favor, instale o Docker Desktop: https://www.docker.com/products/docker-desktop/
    echo Se ja instalou, certifique-se de que o Docker Desktop esta aberto e rodando.
    echo.
    pause
    exit /b 1
)

echo Verificando se o daemon do Docker esta ativo...
docker info >nul 2>&1 || (
    echo.
    echo [AVISO] O Docker esta instalado, mas o aplicativo Docker Desktop nao esta rodando.
    echo Abra o Docker Desktop no Windows e aguarde o icone da baleia ficar verde/estavel.
    echo Em seguida, execute este script novamente.
    echo.
    pause
    exit /b 1
)

echo.
echo Iniciando containers (MySQL 8.0, Spring Boot Backend e React Frontend)...
echo Isso pode levar alguns minutos na primeira execucao para baixar as imagens.
echo.

docker compose up -d --build

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   [SUCESSO] Sistema FinanceExport iniciado no Docker!
    echo ========================================================
    echo.
    echo   - Frontend: http://localhost:5173 ou http://localhost:80
    echo   - Backend API: http://localhost:8080/api
    echo   - Banco MySQL: localhost:3307 (user: root / pass: root)
    echo.
    echo Comandos uteis:
    echo   - Ver logs em tempo real: docker compose logs -f
    echo   - Parar os containers:    docker compose down
    echo.
    set /p OPEN_BROWSER="Deseja abrir o aplicativo no navegador agora? (S/N): "
    if /i "%OPEN_BROWSER%"=="S" (
        start http://localhost:5173
    )
) else (
    echo.
    echo [ERRO] Ocorreu uma falha ao iniciar os containers com o Docker Compose.
    echo Verifique as mensagens de erro acima.
)

pause
