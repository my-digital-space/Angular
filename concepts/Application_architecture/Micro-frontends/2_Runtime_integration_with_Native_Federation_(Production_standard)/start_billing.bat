@echo off
setlocal enabledelayedexpansion

title MFE Remote 2: Billing (Port 4202)
color 0D

echo ======================================================================
echo    Starting Remote 2: Billing MFE (Port 4202)
echo    Framework: Angular 22+ with Native Federation
echo ======================================================================
echo.

cd /d "%~dp0billing-mfe"

:: Verify node_modules
if not exist "node_modules\" (
    echo [ERROR] node_modules not found in billing-mfe!
    pause
    exit /b 1
)

echo [OK] Launching dev-server on port 4202...
call npm run start -- --port 4202

if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] billing-mfe dev server terminated with error code %ERRORLEVEL%.
    pause
)
