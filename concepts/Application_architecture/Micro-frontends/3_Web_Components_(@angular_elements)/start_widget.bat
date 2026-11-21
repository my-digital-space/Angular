@echo off
setlocal enabledelayedexpansion

title MFE Pattern 3: Chat Widget Server (Port 4203)
color 0D

echo ======================================================================
echo    Starting Angular Elements Chat Widget Server (Port 4203)
echo    Framework: Angular 22+ (@angular/elements)
echo ======================================================================
echo.

cd /d "%~dp0chat-widget"

:: Check node_modules
if not exist "node_modules\" (
    echo [ERROR] node_modules not found in chat-widget!
    pause
    exit /b 1
)

echo [OK] Launching dev-server on port 4203...
call npm run start

if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] chat-widget dev server terminated with error code %ERRORLEVEL%.
    pause
)
