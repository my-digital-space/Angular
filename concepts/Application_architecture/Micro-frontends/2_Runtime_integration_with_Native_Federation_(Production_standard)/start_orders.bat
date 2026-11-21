@echo off
setlocal enabledelayedexpansion

title MFE Remote 1: Orders (Port 4201)
color 09

echo ======================================================================
echo    Starting Remote 1: Orders MFE (Port 4201)
echo    Framework: Angular 22+ with Native Federation
echo ======================================================================
echo.

cd /d "%~dp0orders-mfe"

:: Verify node_modules
if not exist "node_modules\" (
    echo [ERROR] node_modules not found in orders-mfe!
    pause
    exit /b 1
)

echo [OK] Launching dev-server on port 4201...
call npm run start -- --port 4201

if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] orders-mfe dev server terminated with error code %ERRORLEVEL%.
    pause
)
