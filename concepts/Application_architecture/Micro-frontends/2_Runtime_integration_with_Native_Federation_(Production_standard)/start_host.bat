@echo off
setlocal enabledelayedexpansion

title MFE Host Shell (Port 4200)
color 0B

echo ======================================================================
echo    Starting Host Shell (Port 4200)
echo    Framework: Angular 22+ with Native Federation
echo ======================================================================
echo.

cd /d "%~dp0host"

:: Verify node_modules
if not exist "node_modules\" (
    echo [ERROR] node_modules not found in host!
    pause
    exit /b 1
)

echo [OK] Launching Host Shell on port 4200...
call npm run start -- --port 4200 --open

if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Host Shell dev server terminated with error code %ERRORLEVEL%.
    pause
)
